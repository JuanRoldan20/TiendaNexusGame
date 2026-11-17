package com.nexusgame.catalog.repository;

import com.nexusgame.catalog.domain.Producto;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /** Productos activos con filtros opcionales (null = sin filtro). */
    @EntityGraph(attributePaths = "categoria")
    @Query("""
            select p from Producto p
            where p.activo = true
              and (:categoriaId is null or p.categoria.id = :categoriaId)
              and (:q is null or lower(p.nombre) like lower(concat('%', :q, '%'))
                              or lower(p.codigo) like lower(concat('%', :q, '%')))
              and (:soloOfertas = false or p.precioOferta is not null)
            """)
    Page<Producto> buscar(@Param("categoriaId") Long categoriaId, @Param("q") String q,
                          @Param("soloOfertas") boolean soloOfertas, Pageable pageable);

    @EntityGraph(attributePaths = "categoria")
    Optional<Producto> findConCategoriaById(Long id);

    /** Bloquea la fila mientras se descuenta stock (evita vender dos veces la última unidad). */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Producto p join fetch p.categoria where p.id = :id")
    Optional<Producto> findParaActualizar(@Param("id") Long id);

    boolean existsByCodigoIgnoreCase(String codigo);

    boolean existsByCodigoIgnoreCaseAndIdNot(String codigo, Long id);

    @EntityGraph(attributePaths = "categoria")
    @Query("select p from Producto p where p.activo = true and p.stockCritico is not null and p.stock <= p.stockCritico order by p.stock asc")
    List<Producto> findCriticos();
}
