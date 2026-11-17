package com.nexusgame.auth.domain;

/**
 * Roles del sistema (Anexo 1):
 * ADMIN    - acceso total.
 * VENDEDOR - solo ve productos y órdenes (lista y detalle).
 * CLIENTE  - solo accede a la tienda.
 */
public enum Rol {
    ADMIN,
    VENDEDOR,
    CLIENTE
}
