package com.nexusgame.catalog.exception;

/** Recurso duplicado (código o nombre repetido) -> 409. */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
