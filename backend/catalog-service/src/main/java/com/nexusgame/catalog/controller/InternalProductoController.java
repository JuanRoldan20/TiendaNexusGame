package com.nexusgame.catalog.controller;

import com.nexusgame.catalog.dto.DescontarStockRequest;
import com.nexusgame.catalog.dto.ProductoResponse;
import com.nexusgame.catalog.service.CatalogoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints servicio-a-servicio. El API Gateway NO enruta /internal/**. */
@RestController
@RequestMapping("/internal/productos")
@Tag(name = "Interno (solo order-service)")
public class InternalProductoController {

    private final CatalogoService service;

    public InternalProductoController(CatalogoService service) {
        this.service = service;
    }

    @PostMapping("/{id}/reponer-stock")
    @Operation(summary = "Compensar un descuento de stock en una compra que falló")
    public ProductoResponse reponerStock(@PathVariable Long id, @Valid @RequestBody DescontarStockRequest request) {
        return service.reponerStock(id, request.cantidad());
    }

    @PostMapping("/{id}/descontar-stock")
    @Operation(summary = "Descuenta stock al confirmar una boleta (422 si no alcanza)")
    public ProductoResponse descontarStock(@PathVariable Long id, @Valid @RequestBody DescontarStockRequest request) {
        return service.descontarStock(id, request.cantidad());
    }
}
