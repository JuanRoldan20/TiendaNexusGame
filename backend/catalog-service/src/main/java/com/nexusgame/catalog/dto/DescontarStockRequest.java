package com.nexusgame.catalog.dto;

import jakarta.validation.constraints.Min;

/** Payload interno que envía order-service al confirmar una boleta. */
public record DescontarStockRequest(@Min(1) int cantidad) {
}
