package com.nexusgame.orders.controller;

import com.nexusgame.orders.dto.BoletaResponse;
import com.nexusgame.orders.dto.CrearBoletaRequest;
import com.nexusgame.orders.service.BoletaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** La identidad (X-User-Id, X-User-Roles) la inyecta el API Gateway desde el JWT. */
@RestController
@RequestMapping("/api/v1/boletas")
@Tag(name = "Boletas")
public class BoletaController {

    private final BoletaService service;

    public BoletaController(BoletaService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Confirmar compra (checkout)")
    public BoletaResponse crear(@Parameter(hidden = true) @RequestHeader("X-User-Id") Long usuarioId,
                                @Valid @RequestBody CrearBoletaRequest request) {
        return service.crear(usuarioId, request);
    }

    @GetMapping("/mias")
    @Operation(summary = "Historial de compras del usuario autenticado")
    public List<BoletaResponse> mias(@Parameter(hidden = true) @RequestHeader("X-User-Id") Long usuarioId) {
        return service.listarMias(usuarioId);
    }

    @GetMapping
    @Operation(summary = "Todas las boletas (ADMIN y VENDEDOR)")
    public List<BoletaResponse> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de una boleta (dueño, ADMIN o VENDEDOR)")
    public BoletaResponse obtener(@PathVariable Long id,
                                  @Parameter(hidden = true) @RequestHeader("X-User-Id") Long usuarioId,
                                  @Parameter(hidden = true) @RequestHeader(value = "X-User-Roles", required = false) String roles) {
        return service.obtener(id, usuarioId, roles);
    }
}
