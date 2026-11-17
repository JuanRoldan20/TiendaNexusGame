package com.nexusgame.auth.controller;

import com.nexusgame.auth.dto.LoginRequest;
import com.nexusgame.auth.dto.RefreshRequest;
import com.nexusgame.auth.dto.RegistroRequest;
import com.nexusgame.auth.dto.RegistroAdminRequest;
import com.nexusgame.auth.dto.RegistroResponse;
import com.nexusgame.auth.dto.TokenResponse;
import com.nexusgame.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import com.nexusgame.auth.domain.Rol;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticación")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registro de cliente desde la tienda (público)")
    public RegistroResponse registrar(@Valid @RequestBody RegistroRequest request) {
        return service.registrar(request);
    }

    @PostMapping("/login")
    @Operation(summary = "Inicio de sesión: devuelve el JWT (público)")
    public TokenResponse login(@Valid @RequestBody LoginRequest request) {
        return service.login(request);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar el access token con un refresh token")
    public TokenResponse refrescar(@Valid @RequestBody RefreshRequest request) {
        return service.refrescar(request);
    }

    @PostMapping("/usuarios")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear usuario con rol desde el administrador (ADMIN)")
    public RegistroResponse crearComoAdmin(@Valid @RequestBody RegistroAdminRequest request) {
        return service.crearUsuario(request.usuario(), request.rol());
    }

    public record CambiarRolRequest(Rol rol) { }

    @PutMapping("/usuarios/{id}/rol")
    @Operation(summary = "Cambiar rol de usuario (ADMIN)")
    public void cambiarRol(@PathVariable Long id, @Valid @RequestBody CambiarRolRequest req) {
        if (req.rol() == null) throw new IllegalArgumentException("El rol es requerido");
        service.actualizarRol(id, req.rol());
    }

    @DeleteMapping("/usuarios/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Desactivar credencial y perfil (ADMIN)")
    public void desactivar(@PathVariable Long id, @RequestHeader("X-User-Id") Long administradorId) {
        if (id.equals(administradorId)) throw new IllegalArgumentException("No puedes desactivar tu propia cuenta");
        service.desactivarUsuario(id);
    }
}
