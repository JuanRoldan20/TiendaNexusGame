package com.nexusgame.catalog.dto;

import org.springframework.data.domain.Page;

import java.util.List;

/** Página serializable estable (no expone la estructura interna de PageImpl). */
public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {

    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }
}
