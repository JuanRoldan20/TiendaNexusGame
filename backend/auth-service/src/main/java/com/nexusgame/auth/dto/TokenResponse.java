package com.nexusgame.auth.dto;

/**
 * Respuesta del login. El frontend guarda el token (localStorage) para mantener la sesión
 * aunque se recargue la página, y lo envía en cada request: Authorization: Bearer ...
 *
 * refreshToken es de un solo uso y se rota al renovar la sesión.
 */
public record TokenResponse(String accessToken, String tokenType, long expiresIn, String refreshToken,
                            Long usuarioId, String correo, String rol) {
}
