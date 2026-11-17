package com.nexusgame.orders.service;

import com.nexusgame.orders.client.CatalogoClient;
import com.nexusgame.orders.domain.Boleta;
import com.nexusgame.orders.dto.BoletaResponse;
import com.nexusgame.orders.dto.CrearBoletaRequest;
import com.nexusgame.orders.exception.AccesoDenegadoException;
import com.nexusgame.orders.exception.NotFoundException;
import com.nexusgame.orders.exception.ReglaNegocioException;
import com.nexusgame.orders.exception.UpstreamException;
import com.nexusgame.orders.repository.BoletaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class BoletaService {
    private static final Logger log = LoggerFactory.getLogger(BoletaService.class);
    private static final Set<String> ROLES_BACKOFFICE = Set.of("ADMIN", "VENDEDOR");

    private final BoletaRepository repository;
    private final CatalogoClient catalogo;

    public BoletaService(BoletaRepository repository, CatalogoClient catalogo) {
        this.repository = repository;
        this.catalogo = catalogo;
    }

    @Transactional
    public BoletaResponse crear(Long usuarioId, CrearBoletaRequest req) {
        if (usuarioId == null || req == null || req.items() == null || req.items().isEmpty() || req.envio() == null) {
            throw new ReglaNegocioException("El pedido debe contener productos y datos de entrega");
        }
        Set<Long> ids = new HashSet<>();
        Boleta boleta = new Boleta(usuarioId, req.envio().nombre(), req.envio().correo(),
                req.envio().region(), req.envio().comuna(), req.envio().direccion(), req.envio().indicaciones());
        for (CrearBoletaRequest.Item item : req.items()) {
            if (item == null || item.productoId() == null || item.cantidad() < 1 || !ids.add(item.productoId())) {
                throw new ReglaNegocioException("Los productos del carrito deben ser únicos y tener cantidades positivas");
            }
            CatalogoClient.ProductoCatalogo producto = obtenerProducto(item.productoId());
            if (producto == null || !producto.activo() || producto.precioFinal() == null) {
                throw new ReglaNegocioException("Uno de los productos no está disponible");
            }
            if (producto.stock() < item.cantidad()) {
                throw new ReglaNegocioException("Stock insuficiente para " + producto.nombre());
            }
            boleta.agregarDetalle(producto.id(), producto.codigo(), producto.nombre(), producto.precioFinal(), item.cantidad());
        }

        List<CrearBoletaRequest.Item> descontados = new ArrayList<>();
        try {
            for (CrearBoletaRequest.Item item : req.items()) {
                descontar(item);
                descontados.add(item);
            }
            return BoletaResponse.from(repository.saveAndFlush(boleta));
        } catch (RuntimeException fallo) {
            for (int i = descontados.size() - 1; i >= 0; i--) {
                CrearBoletaRequest.Item item = descontados.get(i);
                try {
                    catalogo.reponerStock(item.productoId(), new CatalogoClient.DescontarStock(item.cantidad()));
                } catch (RuntimeException compensacion) {
                    log.error("No se pudo reponer stock de producto {} tras una compra fallida", item.productoId(), compensacion);
                }
            }
            throw fallo;
        }
    }

    private CatalogoClient.ProductoCatalogo obtenerProducto(Long id) {
        try {
            return catalogo.obtenerProducto(id);
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) throw new NotFoundException("Producto " + id + " no encontrado");
            if (ex.getStatusCode().value() == 422) throw new ReglaNegocioException("Producto no disponible: " + id);
            throw new UpstreamException("Catálogo respondió " + ex.getStatusCode(), ex);
        } catch (RestClientException ex) {
            throw new UpstreamException("No se pudo consultar el catálogo", ex);
        }
    }

    private void descontar(CrearBoletaRequest.Item item) {
        try {
            catalogo.descontarStock(item.productoId(), new CatalogoClient.DescontarStock(item.cantidad()));
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode().value() == 422 || ex.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new ReglaNegocioException("El stock cambió durante la compra. Revisa el carrito");
            }
            throw new UpstreamException("No fue posible descontar stock", ex);
        } catch (RestClientException ex) {
            throw new UpstreamException("No se pudo confirmar stock en el catálogo", ex);
        }
    }

    @Transactional(readOnly = true)
    public List<BoletaResponse> listarMias(Long usuarioId) {
        return repository.findByUsuarioIdOrderByFechaDesc(usuarioId).stream().map(BoletaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<BoletaResponse> listarTodas() {
        return repository.findAllByOrderByFechaDesc().stream().map(BoletaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public BoletaResponse obtener(Long id, Long usuarioId, String roles) {
        Boleta boleta = repository.findConDetallesById(id)
                .orElseThrow(() -> new NotFoundException("Boleta " + id + " no encontrada"));
        if (!esBackoffice(roles) && !boleta.perteneceA(usuarioId)) {
            throw new AccesoDenegadoException("No tienes permiso para ver esta boleta");
        }
        return BoletaResponse.from(boleta);
    }

    static boolean esBackoffice(String roles) {
        if (roles == null || roles.isBlank()) return false;
        for (String rol : roles.split(",")) {
            if (ROLES_BACKOFFICE.contains(rol.trim())) return true;
        }
        return false;
    }
}
