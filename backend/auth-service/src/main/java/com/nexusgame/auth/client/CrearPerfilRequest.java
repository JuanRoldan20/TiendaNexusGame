package com.nexusgame.auth.client;

import java.time.LocalDate;

/** Contrato de POST /internal/usuarios en users-service. */
public record CrearPerfilRequest(Long id, String run, String nombre, String apellidos, String correo,
                                 LocalDate fechaNacimiento, String region, String comuna, String direccion,
                                 String rol) {
}
