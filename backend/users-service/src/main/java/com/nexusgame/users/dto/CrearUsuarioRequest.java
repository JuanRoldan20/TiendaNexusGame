package com.nexusgame.users.dto;

import com.nexusgame.users.validation.Reglas;
import com.nexusgame.users.validation.Run;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/** Payload interno que envía auth-service al registrar un usuario. */
public record CrearUsuarioRequest(
        @NotNull Long id,
        @NotBlank @Run String run,
        @NotBlank @Size(max = 50) String nombre,
        @NotBlank @Size(max = 100) String apellidos,
        @NotBlank @Size(max = 100) @Pattern(regexp = Reglas.CORREO_PERMITIDO, message = Reglas.MENSAJE_CORREO) String correo,
        @Past LocalDate fechaNacimiento,
        @Size(max = 60) String region,
        @Size(max = 60) String comuna,
        @NotBlank @Size(max = 300) String direccion,
        @NotBlank @Pattern(regexp = "ADMIN|VENDEDOR|CLIENTE") String rol) {
}
