package com.nexusgame.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Toda la autenticación y autorización del sistema vive aquí (Spring Security + JWT).
 * Los microservicios confían en los headers X-User-* que inyecta {@code UserHeadersFilter}.
 *
 * Roles (Anexo 1):
 *  - ADMIN:    acceso total.
 *  - VENDEDOR: ver productos (lista y detalle) y órdenes/boletas (lista y detalle).
 *  - CLIENTE:  solo la tienda (comprar, ver su perfil y sus compras).
 *
 * El orden de las reglas importa: gana la PRIMERA que coincide.
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .cors(Customizer.withDefaults())
                .authorizeExchange(ex -> ex
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()
                        .pathMatchers("/actuator/health", "/actuator/info").permitAll()

                        // ---- Autenticación ----
                        .pathMatchers("/api/v1/auth/usuarios", "/api/v1/auth/usuarios/**").hasRole("ADMIN")
                        .pathMatchers("/api/v1/auth/**").permitAll()

                        // ---- Catálogo: lectura pública, escritura solo ADMIN ----
                        .pathMatchers(HttpMethod.GET, "/api/v1/productos/criticos").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/v1/productos", "/api/v1/productos/**",
                                "/api/v1/categorias", "/api/v1/categorias/**").permitAll()
                        .pathMatchers("/api/v1/productos", "/api/v1/productos/**",
                                "/api/v1/categorias", "/api/v1/categorias/**").hasRole("ADMIN")

                        // ---- Usuarios: /me para cualquiera autenticado, el resto solo ADMIN ----
                        .pathMatchers("/api/v1/usuarios/me").authenticated()
                        .pathMatchers("/api/v1/usuarios", "/api/v1/usuarios/**").hasRole("ADMIN")

                        // ---- Boletas ----
                        .pathMatchers(HttpMethod.POST, "/api/v1/boletas").hasAnyRole("ADMIN", "CLIENTE")
                        .pathMatchers(HttpMethod.GET, "/api/v1/boletas/mias").authenticated()
                        .pathMatchers(HttpMethod.GET, "/api/v1/boletas").hasAnyRole("ADMIN", "VENDEDOR")
                        // El detalle lo puede pedir el dueño: order-service valida que sea suya.
                        .pathMatchers(HttpMethod.GET, "/api/v1/boletas/*").authenticated()

                        .anyExchange().authenticated())
                .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtConverter())))
                .build();
    }

    @Bean
    ReactiveJwtDecoder jwtDecoder(@Value("${jwt.secret}") String secret, @Value("${jwt.issuer}") String issuer) {
        if (secret.length() < 32) {
            throw new IllegalArgumentException("jwt.secret debe tener al menos 32 caracteres");
        }
        var key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        NimbusReactiveJwtDecoder decoder = NimbusReactiveJwtDecoder.withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        // Verifica firma, expiración (exp) y emisor (iss).
        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(issuer));
        return decoder;
    }

    /** Claim "roles": ["ADMIN"] -> authority ROLE_ADMIN. */
    private Converter<Jwt, Mono<AbstractAuthenticationToken>> jwtConverter() {
        var authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName("roles");
        authorities.setAuthorityPrefix("ROLE_");
        var converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);
        return new ReactiveJwtAuthenticationConverterAdapter(converter);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(@Value("${gateway.cors.allowed-origins}") List<String> origins) {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setMaxAge(3600L);
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
