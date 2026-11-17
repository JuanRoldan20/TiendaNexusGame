package com.nexusgame.catalog.service;

import com.nexusgame.catalog.domain.Categoria;
import com.nexusgame.catalog.domain.Producto;
import com.nexusgame.catalog.dto.CategoriaRequest;
import com.nexusgame.catalog.dto.CategoriaResponse;
import com.nexusgame.catalog.dto.PageResponse;
import com.nexusgame.catalog.dto.ProductoRequest;
import com.nexusgame.catalog.dto.ProductoResponse;
import com.nexusgame.catalog.exception.ConflictException;
import com.nexusgame.catalog.exception.NotFoundException;
import com.nexusgame.catalog.repository.CategoriaRepository;
import com.nexusgame.catalog.repository.ProductoRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Lógica de negocio del catálogo. Los controladores solo traducen HTTP <-> este servicio. */
@Service
public class CatalogoService {

    private final ProductoRepository productos;
    private final CategoriaRepository categorias;

    public CatalogoService(ProductoRepository productos, CategoriaRepository categorias) {
        this.productos = productos;
        this.categorias = categorias;
    }

    // ---------- Productos ----------

    @Transactional(readOnly = true)
    public PageResponse<ProductoResponse> buscar(Long categoriaId, String q, boolean soloOfertas, Pageable pageable) {
        String texto = (q == null || q.isBlank()) ? null : q.trim();
        return PageResponse.from(productos.buscar(categoriaId, texto, soloOfertas, pageable)
                .map(ProductoResponse::from));
    }

    /** Devuelve el producto aunque esté inactivo (order-service necesita saberlo). */
    @Transactional(readOnly = true)
    public ProductoResponse obtener(Long id) {
        return ProductoResponse.from(buscarProducto(id));
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest req) {
        if (productos.existsByCodigoIgnoreCase(req.codigo().trim())) {
            throw new ConflictException("Ya existe un producto con código " + req.codigo());
        }
        Producto nuevo = new Producto(req.codigo(), req.nombre(), req.descripcion(), req.precio(),
                req.precioOferta(), req.stock(), req.stockCritico(), req.imagen(),
                buscarCategoria(req.categoriaId()));
        return ProductoResponse.from(productos.save(nuevo));
    }

    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest req) {
        if (productos.existsByCodigoIgnoreCaseAndIdNot(req.codigo().trim(), id)) {
            throw new ConflictException("Ya existe otro producto con código " + req.codigo());
        }
        Producto producto = buscarProducto(id);
        producto.actualizar(req.codigo(), req.nombre(), req.descripcion(), req.precio(), req.precioOferta(),
                req.stock(), req.stockCritico(), req.imagen(), buscarCategoria(req.categoriaId()));
        return ProductoResponse.from(producto);
    }

    @Transactional
    public void eliminar(Long id) {
        buscarProducto(id).desactivar();
    }

    /** Llamado por order-service (endpoint interno) al confirmar una compra. */
    @Transactional
    public ProductoResponse descontarStock(Long id, int cantidad) {
        Producto producto = productos.findParaActualizar(id)
                .orElseThrow(() -> new NotFoundException("Producto " + id + " no encontrado"));
        producto.descontarStock(cantidad);
        return ProductoResponse.from(producto);
    }

    @Transactional
    public ProductoResponse reponerStock(Long id, int cantidad) {
        Producto producto = productos.findParaActualizar(id)
                .orElseThrow(() -> new NotFoundException("Producto " + id + " no encontrado"));
        producto.reponerStock(cantidad);
        return ProductoResponse.from(producto);
    }

    @Transactional(readOnly = true)
    public List<ProductoResponse> criticos() {
        return productos.findCriticos().stream().map(ProductoResponse::from).toList();
    }

    // ---------- Categorías ----------

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarCategorias() {
        return categorias.findAll().stream().map(CategoriaResponse::from).toList();
    }

    @Transactional
    public CategoriaResponse crearCategoria(CategoriaRequest req) {
        if (categorias.existsByNombreIgnoreCase(req.nombre().trim())) {
            throw new ConflictException("La categoría " + req.nombre() + " ya existe");
        }
        return CategoriaResponse.from(categorias.save(new Categoria(req.nombre().trim())));
    }

    @Transactional
    public CategoriaResponse actualizarCategoria(Long id, CategoriaRequest req) {
        Categoria categoria = buscarCategoria(id);
        categoria.renombrar(req.nombre().trim());
        return CategoriaResponse.from(categoria);
    }

    private Producto buscarProducto(Long id) {
        return productos.findConCategoriaById(id)
                .orElseThrow(() -> new NotFoundException("Producto " + id + " no encontrado"));
    }

    private Categoria buscarCategoria(Long id) {
        return categorias.findById(id)
                .orElseThrow(() -> new NotFoundException("Categoría " + id + " no encontrada"));
    }
}
