package com.nexusgame.auth.dto;

import com.nexusgame.auth.validation.Reglas;
import com.nexusgame.auth.validation.Run;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/** Reglas del formulario de registro de usuario (Anexo 1). El rol siempre será CLIENTE. */
public record RegistroRequest(
        @NotBlank(message = "El RUN es requerido") @Run String run,
        @NotBlank(message = "El nombre es requerido") @Size(max = 50, message = "Máximo 50 caracteres") String nombre,
        @NotBlank(message = "Los apellidos son requeridos") @Size(max = 100, message = "Máximo 100 caracteres") String apellidos,
        @NotBlank(message = "El correo es requerido") @Size(max = 100, message = "Máximo 100 caracteres")
        @Pattern(regexp = Reglas.CORREO_PERMITIDO, message = Reglas.MENSAJE_CORREO) String correo,
        @NotBlank(message = "La contraseña es requerida")
        @Size(min = 4, max = 10, message = "La contraseña debe tener entre 4 y 10 caracteres") String password,
        @Past(message = "La fecha debe ser anterior a hoy") LocalDate fechaNacimiento,
        @Size(max = 60) String region,
        @Size(max = 60) String comuna,
        @NotBlank(message = "La dirección es requerida") @Size(max = 300, message = "Máximo 300 caracteres") String direccion) {
}
