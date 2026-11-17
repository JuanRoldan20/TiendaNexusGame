package com.nexusgame.catalog.dto;

import com.nexusgame.catalog.domain.Producto;

import java.math.BigDecimal;

public record ProductoResponse(Long id, String codigo, String nombre, String descripcion,
                               BigDecimal precio, BigDecimal precioOferta, BigDecimal precioFinal,
                               boolean enOferta, int stock, Integer stockCritico, boolean critico,
                               String imagen, boolean activo, Long categoriaId, String categoriaNombre) {

    public static ProductoResponse from(Producto p) {
        return new ProductoResponse(p.getId(), p.getCodigo(), p.getNombre(), p.getDescripcion(),
                p.getPrecio(), p.getPrecioOferta(), p.getPrecioFinal(), p.isEnOferta(),
                p.getStock(), p.getStockCritico(), p.isCritico(), p.getImagen(), p.isActivo(),
                p.getCategoria().getId(), p.getCategoria().getNombre());
    }
}
