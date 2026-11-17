package com.nexusgame.users.controller;

import com.nexusgame.users.dto.ActualizarPerfilRequest;
import com.nexusgame.users.dto.UsuarioResponse;
import com.nexusgame.users.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * La identidad llega en el header X-User-Id, que el API Gateway inyecta desde el JWT.
 * Las rutas de administración se protegen por rol en el gateway.
 */
@RestController
@RequestMapping("/api/v1/usuarios")
@Tag(name = "Usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping("/me")
    @Operation(summary = "Perfil del usuario autenticado")
    public UsuarioResponse me(@Parameter(hidden = true) @RequestHeader("X-User-Id") Long userId) {
        return service.obtener(userId);
    }

    @PutMapping("/me")
    @Operation(summary = "Actualizar mi perfil")
    public UsuarioResponse actualizarMe(@Parameter(hidden = true) @RequestHeader("X-User-Id") Long userId,
                                        @Valid @RequestBody ActualizarPerfilRequest request) {
        return service.actualizarPerfil(userId, request);
    }

    @GetMapping
    @Operation(summary = "Listar usuarios (ADMIN)")
    public List<UsuarioResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Ver un usuario (ADMIN)")
    public UsuarioResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar usuario (ADMIN)")
    public UsuarioResponse actualizar(@PathVariable Long id, @Valid @RequestBody ActualizarPerfilRequest request) {
        return service.actualizarComoAdmin(id, request);
    }

}
