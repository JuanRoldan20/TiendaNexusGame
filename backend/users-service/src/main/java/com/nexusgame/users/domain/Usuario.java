package com.nexusgame.users.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Tabla USUARIO del modelo propuesto (datos personales y de despacho).
 * El id NO se autogenera: es el mismo id de la credencial creada en auth-service,
 * así ambos servicios comparten la identidad del usuario.
 */
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    private Long id;

    @Column(nullable = false, unique = true, length = 9)
    private String run;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 100)
    private String correo;

    private LocalDate fechaNacimiento;

    @Column(length = 60)
    private String region;

    @Column(length = 60)
    private String comuna;

    @Column(nullable = false, length = 300)
    private String direccion;

    /** Copia informativa del rol (la fuente de verdad es auth-service). ADMIN, VENDEDOR o CLIENTE. */
    @Column(nullable = false, length = 20)
    private String rol;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(nullable = false, updatable = false)
    private Instant creadoEn;

    protected Usuario() {
    }

    public Usuario(Long id, String run, String nombre, String apellidos, String correo, LocalDate fechaNacimiento,
                   String region, String comuna, String direccion, String rol) {
        this.id = id;
        this.run = run.trim().toUpperCase();
        this.correo = correo.trim().toLowerCase();
        this.rol = rol;
        this.creadoEn = Instant.now();
        actualizarPerfil(nombre, apellidos, fechaNacimiento, region, comuna, direccion);
    }

    /** El RUN y el correo no se modifican desde el perfil. */
    public void actualizarPerfil(String nombre, String apellidos, LocalDate fechaNacimiento,
                                 String region, String comuna, String direccion) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.fechaNacimiento = fechaNacimiento;
        this.region = region;
        this.comuna = comuna;
        this.direccion = direccion;
    }

    public void cambiarRol(String rol) { this.rol = rol; }
    public void desactivar() { this.activo = false; }
    public boolean isActivo() { return activo; }

    public Long getId() { return id; }
    public String getRun() { return run; }
    public String getNombre() { return nombre; }
    public String getApellidos() { return apellidos; }
    public String getCorreo() { return correo; }
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public String getRegion() { return region; }
    public String getComuna() { return comuna; }
    public String getDireccion() { return direccion; }
    public String getRol() { return rol; }
    public Instant getCreadoEn() { return creadoEn; }
}
