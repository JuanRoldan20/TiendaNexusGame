package com.nexusgame.catalog.exception;

/** Regla de negocio incumplida (stock insuficiente, oferta mayor al precio...) -> 422. */
public class ReglaNegocioException extends RuntimeException {
    public ReglaNegocioException(String message) {
        super(message);
    }
}
