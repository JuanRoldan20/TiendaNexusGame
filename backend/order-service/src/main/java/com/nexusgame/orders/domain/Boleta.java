package com.nexusgame.orders.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Tabla BOLETA del modelo propuesto (USUARIO --> BOLETA --> DETALLE_BOLETA <-- PRODUCTO).
 * usuarioId y productoId son referencias a OTROS microservicios: por eso no son @ManyToOne
 * (cada microservicio tiene su propia base de datos).
 */
@Entity
@Table(name = "boleta")
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long usuarioId;

    @Column(nullable = false)
    private Instant fecha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoBoleta estado;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    // ----- Datos de despacho (checkout) -----
    @Column(nullable = false, length = 150)
    private String nombreCliente;

    @Column(nullable = false, length = 100)
    private String correoCliente;

    @Column(nullable = false, length = 60)
    private String region;

    @Column(nullable = false, length = 60)
    private String comuna;

    @Column(nullable = false, length = 300)
    private String direccion;

    @Column(length = 300)
    private String indicaciones;

    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleBoleta> detalles = new ArrayList<>();

    protected Boleta() {
    }

    public Boleta(Long usuarioId, String nombreCliente, String correoCliente, String region, String comuna,
                  String direccion, String indicaciones) {
        this.usuarioId = usuarioId;
        this.nombreCliente = nombreCliente;
        this.correoCliente = correoCliente;
        this.region = region;
        this.comuna = comuna;
        this.direccion = direccion;
        this.indicaciones = indicaciones;
        this.fecha = Instant.now();
        this.estado = EstadoBoleta.PAGADA;
    }

    /** Agrega una línea y recalcula el total. El precio se "congela" al momento de la compra. */
    public void agregarDetalle(Long productoId, String codigo, String nombre, BigDecimal precioUnitario, int cantidad) {
        detalles.add(new DetalleBoleta(this, productoId, codigo, nombre, precioUnitario, cantidad));
        total = detalles.stream().map(DetalleBoleta::getSubtotal).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void rechazar() {
        this.estado = EstadoBoleta.RECHAZADA;
    }

    public boolean perteneceA(Long usuarioId) {
        return this.usuarioId.equals(usuarioId);
    }

    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public Instant getFecha() { return fecha; }
    public EstadoBoleta getEstado() { return estado; }
    public BigDecimal getTotal() { return total; }
    public String getNombreCliente() { return nombreCliente; }
    public String getCorreoCliente() { return correoCliente; }
    public String getRegion() { return region; }
    public String getComuna() { return comuna; }
    public String getDireccion() { return direccion; }
    public String getIndicaciones() { return indicaciones; }
    public List<DetalleBoleta> getDetalles() { return Collections.unmodifiableList(detalles); }
}
