package com.nexusgame.auth.exception;

/** Correo o contraseña incorrectos -> 401 (mensaje genérico a propósito). */
public class CredencialesInvalidasException extends RuntimeException {
    public CredencialesInvalidasException(String message) {
        super(message);
    }
}
