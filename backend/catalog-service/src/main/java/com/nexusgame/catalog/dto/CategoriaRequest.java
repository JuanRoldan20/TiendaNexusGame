package com.nexusgame.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequest(
        @NotBlank(message = "El nombre es requerido")
        @Size(max = 80, message = "Máximo 80 caracteres") String nombre) {
}
