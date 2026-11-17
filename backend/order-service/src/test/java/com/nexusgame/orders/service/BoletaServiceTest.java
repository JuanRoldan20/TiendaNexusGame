package com.nexusgame.orders.service;

import com.nexusgame.orders.client.CatalogoClient;
import com.nexusgame.orders.domain.Boleta;
import com.nexusgame.orders.dto.CrearBoletaRequest;
import com.nexusgame.orders.exception.AccesoDenegadoException;
import com.nexusgame.orders.exception.ReglaNegocioException;
import com.nexusgame.orders.repository.BoletaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BoletaServiceTest {
    @Mock BoletaRepository repository;
    @Mock CatalogoClient catalogo;
    @InjectMocks BoletaService service;

    CrearBoletaRequest solicitud(List<CrearBoletaRequest.Item> items) {
        return new CrearBoletaRequest(items,
                new CrearBoletaRequest.DatosEnvio("Camila", "cliente@gmail.com", "Valparaíso", "Viña del Mar", "Los Carrera 890", null));
    }
    CatalogoClient.ProductoCatalogo producto(Long id, int stock) {
        return new CatalogoClient.ProductoCatalogo(id, "ABC" + id, "Juego", new BigDecimal("15990"), stock, true);
    }
    Boleta boletaDe(Long usuarioId) {
        return new Boleta(usuarioId, "Camila", "cliente@gmail.com", "Valparaíso", "Viña del Mar", "Los Carrera 890", null);
    }

    @Test void crear_conStockSuficiente_guardaBoletaYDescuentaStock() {
        when(catalogo.obtenerProducto(10L)).thenReturn(producto(10L, 10));
        when(repository.saveAndFlush(any(Boleta.class))).thenAnswer(i -> i.getArgument(0));
        var resultado = service.crear(5L, solicitud(List.of(new CrearBoletaRequest.Item(10L, 2))));
        assertThat(resultado.total()).isEqualByComparingTo("31980");
        assertThat(resultado.detalles()).hasSize(1);
        verify(catalogo).descontarStock(10L, new CatalogoClient.DescontarStock(2));
        verify(repository).saveAndFlush(any(Boleta.class));
    }
    @Test void crear_sinStock_noGuarda() {
        when(catalogo.obtenerProducto(10L)).thenReturn(producto(10L, 1));
        assertThatThrownBy(() -> service.crear(5L, solicitud(List.of(new CrearBoletaRequest.Item(10L,2)))))
            .isInstanceOf(ReglaNegocioException.class).hasMessageContaining("Stock insuficiente");
        verify(repository, never()).saveAndFlush(any());
    }
    @Test void crear_productoRepetido_rechaza() {
        var items=List.of(new CrearBoletaRequest.Item(10L,1),new CrearBoletaRequest.Item(10L,1));
        when(catalogo.obtenerProducto(10L)).thenReturn(producto(10L,10));
        assertThatThrownBy(() -> service.crear(5L, solicitud(items)))
            .isInstanceOf(ReglaNegocioException.class);
    }
    @Test void obtener_clienteVeSuPropiaBoleta() {
        when(repository.findConDetallesById(1L)).thenReturn(Optional.of(boletaDe(3L)));
        assertThat(service.obtener(1L,3L,"CLIENTE").usuarioId()).isEqualTo(3L);
    }
    @Test void obtener_clienteNoVeBoletaAjena() {
        when(repository.findConDetallesById(1L)).thenReturn(Optional.of(boletaDe(3L)));
        assertThatThrownBy(() -> service.obtener(1L,99L,"CLIENTE"))
            .isInstanceOf(AccesoDenegadoException.class);
    }
    @Test void obtener_vendedorPuedeVerCualquierBoleta() {
        when(repository.findConDetallesById(1L)).thenReturn(Optional.of(boletaDe(3L)));
        assertThat(service.obtener(1L,2L,"VENDEDOR").usuarioId()).isEqualTo(3L);
    }
}
