package com.nexusgame.users.controller;

import com.nexusgame.users.dto.CrearUsuarioRequest;
import com.nexusgame.users.dto.UsuarioResponse;
import com.nexusgame.users.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints servicio-a-servicio. El API Gateway NO enruta /internal/**. */
@RestController
@RequestMapping("/internal/usuarios")
@Tag(name = "Interno (solo auth-service)")
public class InternalUsuarioController {

    private final UsuarioService service;

    public InternalUsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crea el perfil cuando auth-service registra una credencial")
    public UsuarioResponse crear(@Valid @RequestBody CrearUsuarioRequest request) {
        return service.crear(request);
    }

    public record RolRequest(String rol) { }

    @PutMapping("/{id}/rol")
    public void cambiarRol(@PathVariable Long id, @RequestBody RolRequest req) {
        service.cambiarRol(id, req.rol());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
