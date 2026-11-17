package com.nexusgame.catalog.domain;

import com.nexusgame.catalog.exception.ReglaNegocioException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

/**
 * Tabla PRODUCTO del modelo propuesto. Reglas del Anexo 1:
 * código (requerido, min 3), nombre (max 100), descripción (opcional, max 500),
 * precio (min 0, decimales), stock (entero, min 0), stock crítico (opcional, min 0),
 * categoría (requerida) e imagen (opcional).
 *
 * Sin setters: el estado solo cambia con métodos que respetan las reglas.
 */
@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;

    /** Precio rebajado. Si es null el producto NO está en oferta. */
    @Column(precision = 12, scale = 2)
    private BigDecimal precioOferta;

    @Column(nullable = false)
    private int stock;

    @Column
    private Integer stockCritico;

    @Column(length = 500)
    private String imagen;

    /** Borrado lógico: un producto inactivo no aparece en la tienda. */
    @Column(nullable = false)
    private boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    protected Producto() {
    }

    public Producto(String codigo, String nombre, String descripcion, BigDecimal precio, BigDecimal precioOferta,
                    int stock, Integer stockCritico, String imagen, Categoria categoria) {
        actualizar(codigo, nombre, descripcion, precio, precioOferta, stock, stockCritico, imagen, categoria);
    }

    public void actualizar(String codigo, String nombre, String descripcion, BigDecimal precio,
                           BigDecimal precioOferta, int stock, Integer stockCritico, String imagen,
                           Categoria categoria) {
        if (precioOferta != null && precioOferta.compareTo(precio) >= 0) {
            throw new ReglaNegocioException("El precio de oferta debe ser menor al precio normal");
        }
        this.codigo = codigo.trim().toUpperCase();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.precioOferta = precioOferta;
        this.stock = stock;
        this.stockCritico = stockCritico;
        this.imagen = imagen;
        this.categoria = categoria;
    }

    /** Usado por order-service al confirmar una compra. */
    public void descontarStock(int cantidad) {
        if (cantidad <= 0) {
            throw new ReglaNegocioException("La cantidad debe ser mayor a 0");
        }
        if (!activo) {
            throw new ReglaNegocioException("El producto " + codigo + " no está disponible");
        }
        if (cantidad > stock) {
            throw new ReglaNegocioException("Stock insuficiente para " + nombre + " (disponible: " + stock + ")");
        }
        this.stock -= cantidad;
    }

    public void reponerStock(int cantidad) {
        if (cantidad <= 0) throw new ReglaNegocioException("La cantidad debe ser mayor a 0");
        this.stock += cantidad;
    }

    public void desactivar() {
        this.activo = false;
    }

    /** Stock igual o inferior al stock crítico -> alerta en el panel de administración. */
    public boolean isCritico() {
        return stockCritico != null && stock <= stockCritico;
    }

    public boolean isEnOferta() {
        return precioOferta != null;
    }

    /** Precio que realmente paga el cliente. */
    public BigDecimal getPrecioFinal() {
        return precioOferta != null ? precioOferta : precio;
    }

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public BigDecimal getPrecio() { return precio; }
    public BigDecimal getPrecioOferta() { return precioOferta; }
    public int getStock() { return stock; }
    public Integer getStockCritico() { return stockCritico; }
    public String getImagen() { return imagen; }
    public boolean isActivo() { return activo; }
    public Categoria getCategoria() { return categoria; }
}
