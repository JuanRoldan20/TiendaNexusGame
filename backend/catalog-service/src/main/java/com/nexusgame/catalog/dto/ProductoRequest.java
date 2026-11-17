package com.nexusgame.catalog.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductoRequest(
        @NotBlank(message = "El código es requerido")
        @Size(min = 3, max = 30, message = "El código debe tener entre 3 y 30 caracteres") String codigo,

        @NotBlank(message = "El nombre es requerido")
        @Size(max = 100, message = "Máximo 100 caracteres") String nombre,

        @Size(max = 500, message = "Máximo 500 caracteres") String descripcion,

        @NotNull(message = "El precio es requerido")
        @DecimalMin(value = "0.00", message = "El precio no puede ser negativo")
        @Digits(integer = 10, fraction = 2) BigDecimal precio,

        @DecimalMin(value = "0.00", message = "El precio de oferta no puede ser negativo")
        @Digits(integer = 10, fraction = 2) BigDecimal precioOferta,

        @NotNull(message = "El stock es requerido")
        @Min(value = 0, message = "El stock no puede ser negativo") Integer stock,

        @Min(value = 0, message = "El stock crítico no puede ser negativo") Integer stockCritico,

        @Size(max = 500) String imagen,

        @NotNull(message = "La categoría es requerida") Long categoriaId) {
}
