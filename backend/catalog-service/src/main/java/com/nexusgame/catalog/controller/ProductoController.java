package com.nexusgame.catalog.controller;

import com.nexusgame.catalog.dto.PageResponse;
import com.nexusgame.catalog.dto.ProductoRequest;
import com.nexusgame.catalog.dto.ProductoResponse;
import com.nexusgame.catalog.service.CatalogoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** GET es público; POST/PUT/DELETE exigen rol ADMIN (regla aplicada en el API Gateway). */
@RestController
@RequestMapping("/api/v1/productos")
@Tag(name = "Productos")
public class ProductoController {

    private final CatalogoService service;

    public ProductoController(CatalogoService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar/buscar productos activos (paginado). ofertas=true filtra solo ofertas")
    public PageResponse<ProductoResponse> buscar(@RequestParam(required = false) Long categoriaId,
                                                 @RequestParam(required = false) String q,
                                                 @RequestParam(defaultValue = "false") boolean ofertas,
                                                 @PageableDefault(size = 24, sort = "nombre", direction = Sort.Direction.ASC)
                                                 Pageable pageable) {
        return service.buscar(categoriaId, q, ofertas, pageable);
    }

    @GetMapping("/criticos")
    @Operation(summary = "Productos con stock crítico (ADMIN)")
    public List<ProductoResponse> criticos() {
        return service.criticos();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de un producto")
    public ProductoResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear producto (ADMIN)")
    public ProductoResponse crear(@Valid @RequestBody ProductoRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar producto (ADMIN)")
    public ProductoResponse actualizar(@PathVariable Long id, @Valid @RequestBody ProductoRequest request) {
        return service.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar producto (borrado lógico, ADMIN)")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
