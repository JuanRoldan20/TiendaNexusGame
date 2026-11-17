package com.nexusgame.auth.service;

import com.nexusgame.auth.client.CrearPerfilRequest;
import com.nexusgame.auth.domain.Credencial;
import com.nexusgame.auth.domain.Rol;
import com.nexusgame.auth.dto.RegistroRequest;
import com.nexusgame.auth.repository.CredencialRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@ConditionalOnProperty(name = "auth.seed-users", havingValue = "true", matchIfMissing = true)
public class UsuariosSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(UsuariosSeeder.class);

    private record Semilla(RegistroRequest datos, Rol rol) {
    }

    private static final List<Semilla> SEMILLAS = List.of(
            new Semilla(new RegistroRequest("111111111", "Ana", "Administradora Nexus", "admin@duoc.cl", "admin123",
                    LocalDate.of(1990, 3, 15), "Región Metropolitana de Santiago", "Santiago",
                    "Av. Libertador Bernardo O'Higgins 1234"), Rol.ADMIN),
            new Semilla(new RegistroRequest("222222222", "Victor", "Vendedor Nexus", "vendedor@duoc.cl", "vende123",
                    LocalDate.of(1995, 7, 2), "Región de Valparaíso", "Viña del Mar", "Calle Valparaíso 555"),
                    Rol.VENDEDOR),
            new Semilla(new RegistroRequest("123456785", "Camila", "Cliente Gamer", "cliente@gmail.com", "cliente123",
                    LocalDate.of(2001, 11, 20), "Región del Biobío", "Concepción", "Los Carrera 890, depto 21"),
                    Rol.CLIENTE));

    private final CredencialRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    public UsuariosSeeder(CredencialRepository repository, PasswordEncoder passwordEncoder, AuthService authService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    @Override
    public void run(ApplicationArguments args) {
        for (Semilla s : SEMILLAS) {
            RegistroRequest d = s.datos();
            Credencial credencial = repository.findByCorreoIgnoreCase(d.correo())
                    .orElseGet(() -> repository.save(
                            new Credencial(d.correo(), passwordEncoder.encode(d.password()), s.rol())));
            try {
                authService.crearPerfil(new CrearPerfilRequest(credencial.getId(), d.run(), d.nombre(),
                        d.apellidos(), d.correo(), d.fechaNacimiento(), d.region(), d.comuna(), d.direccion(),
                        s.rol().name()));
                log.info("Usuario de prueba listo: {} ({})", d.correo(), s.rol());
            } catch (RuntimeException ex) {
                // 409 = el perfil ya existía (normal). Otro error = users-service abajo: no bloquea el arranque.
                log.info("Perfil de {} no creado: {}", d.correo(), ex.getMessage());
            }
        }
    }
}
