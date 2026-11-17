package com.nexusgame.orders.domain;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class BoletaTest {

    private Boleta nueva() {
        return new Boleta(3L, "Camila Cliente", "cliente@gmail.com", "Región del Biobío", "Concepción",
                "Los Carrera 890", null);
    }

    @Test
    void agregarDetalle_calculaSubtotalYTotal() {
        Boleta boleta = nueva();
        boleta.agregarDetalle(1L, "JPC001", "Starfall Odyssey", new BigDecimal("29990"), 2);
        boleta.agregarDetalle(9L, "ACC001", "Control Inalámbrico Pro", new BigDecimal("69990"), 1);

        assertThat(boleta.getDetalles()).hasSize(2);
        assertThat(boleta.getDetalles().get(0).getSubtotal()).isEqualByComparingTo("59980");
        assertThat(boleta.getTotal()).isEqualByComparingTo("129970");
        assertThat(boleta.getEstado()).isEqualTo(EstadoBoleta.PAGADA);
    }

    @Test
    void cantidadCero_noSePermite() {
        assertThatThrownBy(() -> nueva().agregarDetalle(1L, "X", "X", BigDecimal.TEN, 0))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void perteneceA_comparaElUsuario() {
        assertThat(nueva().perteneceA(3L)).isTrue();
        assertThat(nueva().perteneceA(4L)).isFalse();
    }
}
