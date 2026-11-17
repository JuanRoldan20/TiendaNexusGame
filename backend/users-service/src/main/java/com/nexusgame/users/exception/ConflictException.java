package com.nexusgame.users.exception;

/** Recurso duplicado (RUN o correo repetido) -> 409. */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
