package com.nexusgame.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@ConfigurationProperties("jwt")
public record JwtProperties(String secret, String issuer, Duration expiration) {

    public JwtProperties {
        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException("jwt.secret debe tener al menos 32 caracteres");
        }
        if (issuer == null) {
            issuer = "nexus-game-auth";
        }
        if (expiration == null) {
            expiration = Duration.ofHours(1);
        }
    }
}
