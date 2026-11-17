package com.nexusgame.users.validation;

/**
 * Reglas de negocio compartidas (Anexo 1). Son las mismas que valida el frontend
 * en JavaScript: el backend NUNCA confía solo en la validación del navegador.
 */
public final class Reglas {

    /** Solo correos @duoc.cl, @profesor.duoc.cl y @gmail.com. */
    public static final String CORREO_PERMITIDO = "^[A-Za-z0-9._%+-]+@(duoc\\.cl|profesor\\.duoc\\.cl|gmail\\.com)$";

    public static final String MENSAJE_CORREO = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com";

    private Reglas() {
    }
}
