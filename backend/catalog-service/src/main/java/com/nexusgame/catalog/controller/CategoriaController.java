package com.nexusgame.catalog.controller;

import com.nexusgame.catalog.dto.CategoriaRequest;
import com.nexusgame.catalog.dto.CategoriaResponse;
import com.nexusgame.catalog.service.CatalogoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
@Tag(name = "Categorías")
public class CategoriaController {

    private final CatalogoService service;

    public CategoriaController(CatalogoService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar categorías")
    public List<CategoriaResponse> listar() {
        return service.listarCategorias();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear categoría (ADMIN)")
    public CategoriaResponse crear(@Valid @RequestBody CategoriaRequest request) {
        return service.crearCategoria(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Renombrar categoría (ADMIN)")
    public CategoriaResponse actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest request) {
        return service.actualizarCategoria(id, request);
    }
}
