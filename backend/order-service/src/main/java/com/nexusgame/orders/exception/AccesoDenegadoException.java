package com.nexusgame.orders.exception;

/** El usuario intenta ver una boleta que no es suya -> 403. */
public class AccesoDenegadoException extends RuntimeException {
    public AccesoDenegadoException(String message) {
        super(message);
    }
}
