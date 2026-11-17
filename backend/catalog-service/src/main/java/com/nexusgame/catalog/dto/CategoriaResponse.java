package com.nexusgame.catalog.dto;

import com.nexusgame.catalog.domain.Categoria;

public record CategoriaResponse(Long id, String nombre) {

    public static CategoriaResponse from(Categoria c) {
        return new CategoriaResponse(c.getId(), c.getNombre());
    }
}
