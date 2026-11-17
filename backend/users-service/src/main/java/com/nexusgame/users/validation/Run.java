package com.nexusgame.users.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Valida un RUN chileno sin puntos ni guion (ej: 19011022K): largo 7 a 9 y dígito verificador
 * correcto (módulo 11). Ejemplo de validación personalizada con Bean Validation.
 */
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = RunValidator.class)
public @interface Run {

    String message() default "RUN inválido (sin puntos ni guion, ej: 19011022K)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
