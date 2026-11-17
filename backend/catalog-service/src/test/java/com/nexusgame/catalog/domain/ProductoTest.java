package com.nexusgame.catalog.domain;

import com.nexusgame.catalog.exception.ReglaNegocioException;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/** Pruebas unitarias puras de las reglas de negocio de Producto (sin Spring). */
class ProductoTest {

    private final Categoria categoria = new Categoria("Juegos PC");

    private Producto producto(int stock, Integer critico) {
        return new Producto("jpc001", "Starfall", null, new BigDecimal("39990"), null, stock, critico, null, categoria);
    }

    @Test
    void codigo_seGuardaEnMayusculas() {
        assertThat(producto(10, 2).getCodigo()).isEqualTo("JPC001");
    }

    @Test
    void descontarStock_restaLaCantidad() {
        Producto p = producto(10, 2);
        p.descontarStock(3);
        assertThat(p.getStock()).isEqualTo(7);
    }

    @Test
    void descontarStock_sinStockSuficiente_lanzaExcepcion() {
        Producto p = producto(2, 1);
        assertThatThrownBy(() -> p.descontarStock(5))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessageContaining("Stock insuficiente");
    }

    @Test
    void esCritico_cuandoStockIgualOMenorAlCritico() {
        assertThat(producto(5, 5).isCritico()).isTrue();
        assertThat(producto(6, 5).isCritico()).isFalse();
        assertThat(producto(0, null).isCritico()).isFalse();
    }

    @Test
    void oferta_mayorAlPrecio_noSePermite() {
        assertThatThrownBy(() -> new Producto("ABC", "X", null, new BigDecimal("1000"), new BigDecimal("1500"),
                1, null, null, categoria))
                .isInstanceOf(ReglaNegocioException.class);
    }

    @Test
    void precioFinal_usaOfertaSiExiste() {
        Producto p = new Producto("ABC", "X", null, new BigDecimal("1000"), new BigDecimal("800"),
                1, null, null, categoria);
        assertThat(p.isEnOferta()).isTrue();
        assertThat(p.getPrecioFinal()).isEqualByComparingTo("800");
    }
}
