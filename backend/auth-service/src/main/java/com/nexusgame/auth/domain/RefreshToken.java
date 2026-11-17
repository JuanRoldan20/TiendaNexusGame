package com.nexusgame.auth.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "refresh_token")
public class RefreshToken {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String tokenHash;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "credencial_id", nullable = false)
    private Credencial credencial;

    @Column(nullable = false)
    private Instant expiraEn;

    @Column(nullable = false)
    private boolean revocado;

    protected RefreshToken() { }
    public RefreshToken(String tokenHash, Credencial credencial, Instant expiraEn) {
        this.tokenHash = tokenHash;
        this.credencial = credencial;
        this.expiraEn = expiraEn;
    }
    public boolean esValido() { return !revocado && expiraEn.isAfter(Instant.now()) && credencial.isActivo(); }
    public void revocar() { revocado = true; }
    public Credencial getCredencial() { return credencial; }
}
