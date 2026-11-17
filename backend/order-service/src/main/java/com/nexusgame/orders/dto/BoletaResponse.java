package com.nexusgame.orders.dto;

import com.nexusgame.orders.domain.Boleta;
import com.nexusgame.orders.domain.DetalleBoleta;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record BoletaResponse(Long id, Long usuarioId, Instant fecha, String estado, BigDecimal total,
                             String nombreCliente, String correoCliente, String region, String comuna,
                             String direccion, String indicaciones, List<Detalle> detalles) {

    public record Detalle(Long productoId, String codigo, String nombre, BigDecimal precioUnitario,
                          int cantidad, BigDecimal subtotal) {

        static Detalle from(DetalleBoleta d) {
            return new Detalle(d.getProductoId(), d.getCodigoProducto(), d.getNombreProducto(),
                    d.getPrecioUnitario(), d.getCantidad(), d.getSubtotal());
        }
    }

    public static BoletaResponse from(Boleta b) {
        return new BoletaResponse(b.getId(), b.getUsuarioId(), b.getFecha(), b.getEstado().name(), b.getTotal(),
                b.getNombreCliente(), b.getCorreoCliente(), b.getRegion(), b.getComuna(), b.getDireccion(),
                b.getIndicaciones(), b.getDetalles().stream().map(Detalle::from).toList());
    }
}
