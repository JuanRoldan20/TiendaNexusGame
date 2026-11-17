package com.nexusgame.auth.exception;

/** users-service no responde -> 503. */
public class UpstreamException extends RuntimeException {
    public UpstreamException(String message, Throwable cause) {
        super(message, cause);
    }
}
