package com.nexusgame.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/** Lo que el propio usuario puede editar de su perfil (RUN y correo quedan fijos). */
public record ActualizarPerfilRequest(
        @NotBlank(message = "El nombre es requerido") @Size(max = 50, message = "Máximo 50 caracteres") String nombre,
        @NotBlank(message = "Los apellidos son requeridos") @Size(max = 100, message = "Máximo 100 caracteres") String apellidos,
        @Past(message = "La fecha debe ser anterior a hoy") LocalDate fechaNacimiento,
        @Size(max = 60) String region,
        @Size(max = 60) String comuna,
        @NotBlank(message = "La dirección es requerida") @Size(max = 300, message = "Máximo 300 caracteres") String direccion) {
}
