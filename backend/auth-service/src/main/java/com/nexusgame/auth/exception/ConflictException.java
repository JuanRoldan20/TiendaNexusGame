package com.nexusgame.auth.exception;

/** Correo o RUN ya registrado -> 409. */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
