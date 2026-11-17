package com.nexusgame.users.dto;

import com.nexusgame.users.domain.Usuario;

import java.time.Instant;
import java.time.LocalDate;

public record UsuarioResponse(Long id, String run, String nombre, String apellidos, String correo,
                              LocalDate fechaNacimiento, String region, String comuna, String direccion,
                              String rol, Instant creadoEn) {

    public static UsuarioResponse from(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getRun(), u.getNombre(), u.getApellidos(), u.getCorreo(),
                u.getFechaNacimiento(), u.getRegion(), u.getComuna(), u.getDireccion(), u.getRol(),
                u.getCreadoEn());
    }
}
