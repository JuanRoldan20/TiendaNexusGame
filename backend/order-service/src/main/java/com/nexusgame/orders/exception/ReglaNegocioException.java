package com.nexusgame.orders.exception;

/** Regla de negocio incumplida (sin stock, producto inactivo...) -> 422. */
public class ReglaNegocioException extends RuntimeException {
    public ReglaNegocioException(String message) {
        super(message);
    }
}
