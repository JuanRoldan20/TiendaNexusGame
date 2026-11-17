package com.nexusgame.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Propaga la identidad hacia los servicios internos:
 * 1. Elimina cualquier X-User-* enviado por el cliente (evita suplantación).
 * 2. Si hay JWT válido, agrega X-User-Id, X-User-Email y X-User-Roles.
 */
@Component
public class UserHeadersFilter implements GlobalFilter, Ordered {

    public static final String USER_ID = "X-User-Id";
    public static final String USER_EMAIL = "X-User-Email";
    public static final String USER_ROLES = "X-User-Roles";

    private static final List<String> IDENTITY_HEADERS = List.of(USER_ID, USER_EMAIL, USER_ROLES);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return exchange.getPrincipal()
                .filter(JwtAuthenticationToken.class::isInstance)
                .cast(JwtAuthenticationToken.class)
                .map(auth -> mutate(exchange, auth))
                .switchIfEmpty(Mono.fromSupplier(() -> mutate(exchange, null)))
                .flatMap(chain::filter);
    }

    private ServerWebExchange mutate(ServerWebExchange exchange, JwtAuthenticationToken auth) {
        return exchange.mutate()
                .request(request -> request.headers(headers -> {
                    IDENTITY_HEADERS.forEach(headers::remove);
                    if (auth != null) {
                        addIdentity(headers, auth);
                    }
                }))
                .build();
    }

    private void addIdentity(HttpHeaders headers, JwtAuthenticationToken auth) {
        headers.set(USER_ID, auth.getToken().getSubject());
        String correo = auth.getToken().getClaimAsString("correo");
        if (correo != null) {
            headers.set(USER_EMAIL, correo);
        }
        headers.set(USER_ROLES, auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                // Spring Security 7 agrega authorities de factor (p.ej. FACTOR_BEARER); solo propagamos roles.
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> a.substring("ROLE_".length()))
                .collect(Collectors.joining(",")));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
