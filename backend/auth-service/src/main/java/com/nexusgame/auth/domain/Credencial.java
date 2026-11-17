package com.nexusgame.auth.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Credencial de acceso. Su id es el "usuarioId" de todo el sistema: va como subject
 * del JWT y es el mismo id del perfil en users-service.
 */
@Entity
@Table(name = "credencial")
public class Credencial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String correo;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    @Column(nullable = false)
    private boolean activo = true;

    protected Credencial() {
    }

    public Credencial(String correo, String passwordHash, Rol rol) {
        this.correo = correo.trim().toLowerCase();
        this.passwordHash = passwordHash;
        this.rol = rol;
    }

    public void cambiarRol(Rol rol) { this.rol = rol; }
    public void desactivar() { this.activo = false; }

    public Long getId() { return id; }
    public String getCorreo() { return correo; }
    public String getPasswordHash() { return passwordHash; }
    public Rol getRol() { return rol; }
    public boolean isActivo() { return activo; }
}
