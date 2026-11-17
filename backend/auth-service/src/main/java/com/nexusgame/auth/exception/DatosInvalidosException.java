package com.nexusgame.auth.exception;

/** users-service rechazó los datos del perfil -> 400. */
public class DatosInvalidosException extends RuntimeException {
    public DatosInvalidosException(String message) {
        super(message);
    }
}
