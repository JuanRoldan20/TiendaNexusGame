package com.nexusgame.orders.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Lo que envía el frontend al confirmar el checkout: los productos del carrito (localStorage)
 * y los datos de despacho. El PRECIO no viene del cliente: se consulta en catalog-service
 * (nunca confiar en precios que manda el navegador).
 */
public record CrearBoletaRequest(
        @NotEmpty(message = "El carrito está vacío") List<@Valid Item> items,
        @NotNull @Valid DatosEnvio envio) {

    public record Item(@NotNull Long productoId,
                       @Min(value = 1, message = "La cantidad mínima es 1") int cantidad) {
    }

    public record DatosEnvio(
            @NotBlank @Size(max = 150) String nombre,
            @NotBlank @Size(max = 100) String correo,
            @NotBlank @Size(max = 60) String region,
            @NotBlank @Size(max = 60) String comuna,
            @NotBlank @Size(max = 300) String direccion,
            @Size(max = 300) String indicaciones) {
    }
}
