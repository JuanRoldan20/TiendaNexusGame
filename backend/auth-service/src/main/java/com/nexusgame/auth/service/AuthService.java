package com.nexusgame.auth.service;

import com.nexusgame.auth.client.CrearPerfilRequest;
import com.nexusgame.auth.client.UsuariosClient;
import com.nexusgame.auth.domain.Credencial;
import com.nexusgame.auth.domain.Rol;
import com.nexusgame.auth.dto.LoginRequest;
import com.nexusgame.auth.dto.RefreshRequest;
import com.nexusgame.auth.dto.RegistroRequest;
import com.nexusgame.auth.dto.RegistroResponse;
import com.nexusgame.auth.dto.TokenResponse;
import com.nexusgame.auth.exception.ConflictException;
import com.nexusgame.auth.exception.CredencialesInvalidasException;
import com.nexusgame.auth.exception.DatosInvalidosException;
import com.nexusgame.auth.exception.UpstreamException;
import com.nexusgame.auth.repository.CredencialRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;

@Service
public class AuthService {

    private final CredencialRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final RefreshTokenService refreshTokens;
    private final UsuariosClient usuariosClient;

    public AuthService(CredencialRepository repository, PasswordEncoder passwordEncoder,
                       TokenService tokenService, UsuariosClient usuariosClient, RefreshTokenService refreshTokens) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.refreshTokens = refreshTokens;
        this.usuariosClient = usuariosClient;
    }

    /**
     * Registro desde la tienda: siempre crea un CLIENTE.
     * Crea la credencial y luego el perfil en users-service. Si users-service falla,
     * la excepción hace rollback de la credencial (no quedan credenciales huérfanas).
     */
    @Transactional
    public RegistroResponse registrar(RegistroRequest req) {
        return crearUsuario(req, Rol.CLIENTE);
    }

    @Transactional
    public TokenResponse login(LoginRequest req) {
        Credencial credencial = repository.findByCorreoIgnoreCase(req.correo().trim())
                .filter(Credencial::isActivo)
                .filter(c -> passwordEncoder.matches(req.password(), c.getPasswordHash()))
                // Mensaje genérico: no revelar si el correo existe o no.
                .orElseThrow(() -> new CredencialesInvalidasException("Correo o contraseña incorrectos"));
        return emitirTokens(credencial);
    }

    @Transactional
    public TokenResponse refrescar(RefreshRequest req) {
        return emitirTokens(refreshTokens.consumir(req.refreshToken()));
    }

    private TokenResponse emitirTokens(Credencial credencial) {
        return new TokenResponse(tokenService.generarAccessToken(credencial), "Bearer",
                tokenService.segundosDeVigencia(), refreshTokens.emitir(credencial), credencial.getId(),
                credencial.getCorreo(), credencial.getRol().name());
    }

    /**
     * Usado por el seeder (y por el futuro mantenedor de usuarios del administrador).
     */
    @Transactional
    public RegistroResponse crearUsuario(RegistroRequest req, Rol rol) {
        if (repository.existsByCorreoIgnoreCase(req.correo().trim())) {
            throw new ConflictException("El correo ya está registrado");
        }
        Credencial credencial = repository.saveAndFlush(
                new Credencial(req.correo(), passwordEncoder.encode(req.password()), rol));

        crearPerfil(new CrearPerfilRequest(credencial.getId(), req.run(), req.nombre(), req.apellidos(),
                credencial.getCorreo(), req.fechaNacimiento(), req.region(), req.comuna(), req.direccion(),
                rol.name()));

        return new RegistroResponse(credencial.getId(), credencial.getCorreo(), rol.name());
    }

    @Transactional
    public void actualizarRol(Long id, Rol rol) {
        Credencial credencial = repository.findById(id)
                .orElseThrow(() -> new DatosInvalidosException("Usuario no encontrado"));
        try {
            usuariosClient.actualizarRol(id, new UsuariosClient.RolRequest(rol.name()));
        } catch (RestClientException ex) {
            throw new UpstreamException("No fue posible actualizar el rol del perfil", ex);
        }
        credencial.cambiarRol(rol);
    }

    @Transactional
    public void desactivarUsuario(Long id) {
        Credencial credencial = repository.findById(id)
                .orElseThrow(() -> new DatosInvalidosException("Usuario no encontrado"));
        try {
            usuariosClient.desactivarPerfil(id);
        } catch (RestClientException ex) {
            throw new UpstreamException("No fue posible desactivar el perfil", ex);
        }
        credencial.desactivar();
    }

    void crearPerfil(CrearPerfilRequest request) {
        try {
            usuariosClient.crearPerfil(request);
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.CONFLICT) {
                throw new ConflictException("El RUN o correo ya está registrado");
            }
            if (ex.getStatusCode() == HttpStatus.BAD_REQUEST) {
                throw new DatosInvalidosException("Datos de perfil inválidos: " + ex.getResponseBodyAsString());
            }
            throw new UpstreamException("users-service rechazó el perfil: " + ex.getStatusCode(), ex);
        } catch (RestClientException ex) {
            throw new UpstreamException("users-service no disponible. ¿Está levantado en el puerto 9082?", ex);
        }
    }
}
