package com.nexusgame.users.service;

import com.nexusgame.users.domain.Usuario;
import com.nexusgame.users.dto.ActualizarPerfilRequest;
import com.nexusgame.users.dto.CrearUsuarioRequest;
import com.nexusgame.users.dto.UsuarioResponse;
import com.nexusgame.users.exception.ConflictException;
import com.nexusgame.users.exception.NotFoundException;
import com.nexusgame.users.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public UsuarioResponse crear(CrearUsuarioRequest req) {
        if (repository.existsById(req.id())) {
            throw new ConflictException("El usuario ya existe");
        }
        if (repository.existsByRunIgnoreCase(req.run().trim())) {
            throw new ConflictException("El RUN ya está registrado");
        }
        if (repository.existsByCorreoIgnoreCase(req.correo().trim())) {
            throw new ConflictException("El correo ya está registrado");
        }
        Usuario nuevo = new Usuario(req.id(), req.run(), req.nombre(), req.apellidos(), req.correo(),
                req.fechaNacimiento(), req.region(), req.comuna(), req.direccion(), req.rol());
        return UsuarioResponse.from(repository.save(nuevo));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtener(Long id) {
        return UsuarioResponse.from(buscar(id));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return repository.findAllByOrderByIdAsc().stream().filter(Usuario::isActivo).map(UsuarioResponse::from).toList();
    }

    @Transactional
    public UsuarioResponse actualizarPerfil(Long id, ActualizarPerfilRequest req) {
        Usuario usuario = buscar(id);
        usuario.actualizarPerfil(req.nombre(), req.apellidos(), req.fechaNacimiento(), req.region(),
                req.comuna(), req.direccion());
        return UsuarioResponse.from(usuario);
    }

    @Transactional
    public UsuarioResponse actualizarComoAdmin(Long id, ActualizarPerfilRequest req) {
        return actualizarPerfil(id, req);
    }

    @Transactional
    public void eliminar(Long id) {
        buscar(id).desactivar();
    }

    @Transactional
    public void cambiarRol(Long id, String rol) {
        if (!List.of("ADMIN", "VENDEDOR", "CLIENTE").contains(rol)) {
            throw new IllegalArgumentException("Rol inválido");
        }
        buscar(id).cambiarRol(rol);
    }

    private Usuario buscar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario " + id + " no encontrado"));
    }
}
