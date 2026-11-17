package com.nexusgame.catalog.service;

import com.nexusgame.catalog.domain.Categoria;
import com.nexusgame.catalog.domain.Producto;
import com.nexusgame.catalog.repository.CategoriaRepository;
import com.nexusgame.catalog.repository.ProductoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/** Catálogo de ejemplo para poder probar la tienda al iniciar con MySQL vacío. */
@Component
@ConditionalOnProperty(name = "catalog.seed-data", havingValue = "true", matchIfMissing = true)
public class CatalogoSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(CatalogoSeeder.class);

    private final CategoriaRepository categorias;
    private final ProductoRepository productos;

    public CatalogoSeeder(CategoriaRepository categorias, ProductoRepository productos) {
        this.categorias = categorias;
        this.productos = productos;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (categorias.count() > 0) {
            return;
        }
        Categoria pc = categorias.save(new Categoria("Juegos PC"));
        Categoria consola = categorias.save(new Categoria("Juegos Consola"));
        Categoria consolas = categorias.save(new Categoria("Consolas"));
        Categoria accesorios = categorias.save(new Categoria("Accesorios"));
        Categoria gift = categorias.save(new Categoria("Gift Cards"));

        productos.saveAll(List.of(
                p("JPC001", "Starfall Odyssey", "RPG de mundo abierto espacial con más de 80 horas de campaña.", "39990", "29990", 25, 5, pc),
                p("JPC002", "Neon Drift Racing", "Carreras arcade en una ciudad cyberpunk, multijugador online.", "24990", null, 18, 5, pc),
                p("JPC003", "Kingdoms of Ember", "Estrategia por turnos: construye y defiende tu reino.", "29990", null, 4, 5, pc),
                p("JCO001", "Shadow Realm Chronicles", "Acción y aventura en un reino oscuro. Edición estándar.", "49990", "42990", 30, 8, consola),
                p("JCO002", "Turbo Kart Party", "Carreras de karts para jugar en familia, hasta 4 jugadores.", "44990", null, 12, 5, consola),
                p("JCO003", "Pixel Legends Remaster", "Clásico de plataformas remasterizado en 4K.", "19990", "14990", 3, 5, consola),
                p("CON001", "Consola Nexus One", "Consola de última generación, 1 TB SSD, 4K a 120 Hz.", "549990", null, 6, 3, consolas),
                p("CON002", "Consola Portátil Nexus Go", "Portátil híbrida con pantalla OLED de 7 pulgadas.", "329990", "299990", 9, 3, consolas),
                p("ACC001", "Control Inalámbrico Pro", "Control con gatillos adaptativos y batería de 30 horas.", "69990", null, 40, 10, accesorios),
                p("ACC002", "Audífonos Gamer 7.1", "Sonido envolvente 7.1 y micrófono con cancelación de ruido.", "59990", "49990", 22, 5, accesorios),
                p("ACC003", "Teclado Mecánico RGB", "Switches rojos, layout español, iluminación RGB.", "54990", null, 2, 5, accesorios),
                p("GFT001", "Gift Card Nexus $20.000", "Tarjeta de regalo canjeable en toda la tienda.", "20000", null, 100, 10, gift)));
        log.info("Catálogo de ejemplo cargado: {} categorías, {} productos", categorias.count(), productos.count());
    }

    private static Producto p(String codigo, String nombre, String descripcion, String precio, String oferta,
                              int stock, int critico, Categoria categoria) {
        return new Producto(codigo, nombre, descripcion, new BigDecimal(precio),
                oferta == null ? null : new BigDecimal(oferta), stock, critico, null, categoria);
    }
}
