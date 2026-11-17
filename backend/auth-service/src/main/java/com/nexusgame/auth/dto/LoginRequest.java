package com.nexusgame.auth.dto;

import com.nexusgame.auth.validation.Reglas;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Reglas del formulario de inicio de sesión (Anexo 1). */
public record LoginRequest(
        @NotBlank(message = "El correo es requerido")
        @Size(max = 100, message = "Máximo 100 caracteres")
        @Pattern(regexp = Reglas.CORREO_PERMITIDO, message = Reglas.MENSAJE_CORREO) String correo,

        @NotBlank(message = "La contraseña es requerida")
        @Size(min = 4, max = 10, message = "La contraseña debe tener entre 4 y 10 caracteres") String password) {
}
