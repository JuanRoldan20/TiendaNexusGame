package com.nexusgame.auth.service;

import com.nexusgame.auth.config.JwtProperties;
import com.nexusgame.auth.domain.Credencial;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Emite JWT firmados con HS256. El api-gateway los valida con el mismo secreto.
 * Claims: sub = id del usuario, correo, roles = ["ADMIN" | "VENDEDOR" | "CLIENTE"].
 */
@Service
public class TokenService {

    private final JwtEncoder encoder;
    private final JwtProperties props;

    public TokenService(JwtEncoder encoder, JwtProperties props) {
        this.encoder = encoder;
        this.props = props;
    }

    public String generarAccessToken(Credencial credencial) {
        Instant ahora = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(props.issuer())
                .subject(String.valueOf(credencial.getId()))
                .issuedAt(ahora)
                .expiresAt(ahora.plus(props.expiration()))
                .claim("correo", credencial.getCorreo())
                .claim("roles", List.of(credencial.getRol().name()))
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

    public long segundosDeVigencia() {
        return props.expiration().toSeconds();
    }
}
