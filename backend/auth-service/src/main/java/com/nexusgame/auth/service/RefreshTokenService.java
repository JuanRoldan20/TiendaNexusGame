package com.nexusgame.auth.service;

import com.nexusgame.auth.domain.Credencial;
import com.nexusgame.auth.domain.RefreshToken;
import com.nexusgame.auth.exception.CredencialesInvalidasException;
import com.nexusgame.auth.repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository repository;
    private final SecureRandom random = new SecureRandom();
    public RefreshTokenService(RefreshTokenRepository repository) { this.repository = repository; }

    public String emitir(Credencial credencial) {
        byte[] bytes = new byte[48];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        repository.save(new RefreshToken(hash(token), credencial, Instant.now().plus(7, ChronoUnit.DAYS)));
        return token;
    }

    public Credencial consumir(String token) {
        RefreshToken encontrado = repository.findForRotation(hash(token))
                .orElseThrow(() -> new CredencialesInvalidasException("Sesión expirada. Vuelve a ingresar"));
        if (!encontrado.esValido()) throw new CredencialesInvalidasException("Sesión expirada. Vuelve a ingresar");
        encontrado.revocar();
        return encontrado.getCredencial();
    }

    private String hash(String token) {
        try {
            byte[] resultado = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(resultado);
        } catch (java.security.NoSuchAlgorithmException ex) {
            throw new IllegalStateException(ex);
        }
    }
}
