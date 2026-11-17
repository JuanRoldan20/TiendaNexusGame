package com.nexusgame.users.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class RunValidatorTest {

    @ParameterizedTest
    @ValueSource(strings = {"123456785", "111111111", "222222222", "19011029K"})
    void runsValidos(String run) {
        assertThat(RunValidator.esValido(run)).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {"123456789", "12.345.678-5", "12345678-5", "abc", "12345", "1234567890"})
    void runsInvalidos(String run) {
        assertThat(RunValidator.esValido(run)).isFalse();
    }

    @Test
    void dvK_seAceptaEnMinuscula() {
        assertThat(RunValidator.esValido("19011029k")).isTrue();
    }
}
