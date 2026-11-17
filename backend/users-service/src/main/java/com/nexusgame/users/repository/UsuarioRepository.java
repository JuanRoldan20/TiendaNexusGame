package com.nexusgame.users.repository;

import com.nexusgame.users.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByRunIgnoreCase(String run);

    boolean existsByCorreoIgnoreCase(String correo);

    List<Usuario> findAllByOrderByIdAsc();
}
