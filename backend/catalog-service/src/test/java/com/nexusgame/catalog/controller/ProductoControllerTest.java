package com.nexusgame.catalog.controller;

import com.nexusgame.catalog.dto.ProductoResponse;
import com.nexusgame.catalog.exception.NotFoundException;
import com.nexusgame.catalog.service.CatalogoService;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductoController.class)
class ProductoControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    CatalogoService service;

    @Test
    void obtener_ok() throws Exception {
        when(service.obtener(1L)).thenReturn(new ProductoResponse(1L, "JPC001", "Starfall Odyssey", null,
                new BigDecimal("39990"), null, new BigDecimal("39990"), false, 10, 2, false, null, true,
                1L, "Juegos PC"));

        mvc.perform(get("/api/v1/productos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Starfall Odyssey"))
                .andExpect(jsonPath("$.precio").value(39990));
    }

    @Test
    void obtener_noExiste_404() throws Exception {
        when(service.obtener(9L)).thenThrow(new NotFoundException("Producto 9 no encontrado"));

        mvc.perform(get("/api/v1/productos/9"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("Producto 9 no encontrado"));
    }

    @Test
    void crear_conDatosInvalidos_400() throws Exception {
        mvc.perform(post("/api/v1/productos").contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"codigo":"AB","nombre":"","precio":-1,"stock":1,"categoriaId":1}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.codigo").exists())
                .andExpect(jsonPath("$.errors.nombre").exists())
                .andExpect(jsonPath("$.errors.precio").exists());
    }

    @Test
    @Disabled("TODO alumno: habilitar cuando implemente GET /api/v1/productos/criticos")
    void criticos_devuelveSoloProductosConStockCritico() throws Exception {
        // TODO alumno: mockear service.criticos() y verificar la respuesta 200 con jsonPath.
    }
}
