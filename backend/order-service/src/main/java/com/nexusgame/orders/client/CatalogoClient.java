package com.nexusgame.orders.client;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import java.math.BigDecimal;

/** Cliente declarativo hacia catalog-service (llamada directa, no pasa por el gateway). Ya está listo. */
@HttpExchange
public interface CatalogoClient {

    @GetExchange("/api/v1/productos/{id}")
    ProductoCatalogo obtenerProducto(@PathVariable Long id);

    @PostExchange("/internal/productos/{id}/reponer-stock")
    ProductoCatalogo reponerStock(@PathVariable Long id, @RequestBody DescontarStock request);

    @PostExchange("/internal/productos/{id}/descontar-stock")
    ProductoCatalogo descontarStock(@PathVariable Long id, @RequestBody DescontarStock request);

    /** Subconjunto de ProductoResponse de catalog-service que necesita la boleta. */
    record ProductoCatalogo(Long id, String codigo, String nombre, BigDecimal precioFinal, int stock,
                            boolean activo) {
    }

    record DescontarStock(int cantidad) {
    }
}
