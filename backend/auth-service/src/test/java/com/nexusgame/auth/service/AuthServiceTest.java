package com.nexusgame.auth.service;

import com.nexusgame.auth.client.UsuariosClient;
import com.nexusgame.auth.domain.Credencial;
import com.nexusgame.auth.domain.Rol;
import com.nexusgame.auth.dto.LoginRequest;
import com.nexusgame.auth.dto.TokenResponse;
import com.nexusgame.auth.exception.CredencialesInvalidasException;
import com.nexusgame.auth.repository.CredencialRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock CredencialRepository repository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock TokenService tokenService;
    @Mock RefreshTokenService refreshTokens;
    @Mock UsuariosClient usuariosClient;

    @InjectMocks AuthService service;

    @Test
    void login_correcto_devuelveTokenConRol() {
        Credencial admin = new Credencial("admin@duoc.cl", "hash", Rol.ADMIN);
        when(repository.findByCorreoIgnoreCase("admin@duoc.cl")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("admin123", "hash")).thenReturn(true);
        when(tokenService.generarAccessToken(admin)).thenReturn("jwt");
        when(tokenService.segundosDeVigencia()).thenReturn(3600L);
        when(refreshTokens.emitir(admin)).thenReturn("refresh-demo");

        TokenResponse token = service.login(new LoginRequest("admin@duoc.cl", "admin123"));

        assertThat(token.accessToken()).isEqualTo("jwt");
        assertThat(token.rol()).isEqualTo("ADMIN");
        assertThat(token.refreshToken()).isEqualTo("refresh-demo");
    }

    @Test
    void login_claveIncorrecta_401() {
        Credencial cliente = new Credencial("cliente@gmail.com", "hash", Rol.CLIENTE);
        when(repository.findByCorreoIgnoreCase("cliente@gmail.com")).thenReturn(Optional.of(cliente));
        when(passwordEncoder.matches("mala", "hash")).thenReturn(false);

        assertThatThrownBy(() -> service.login(new LoginRequest("cliente@gmail.com", "mala")))
                .isInstanceOf(CredencialesInvalidasException.class);
    }
}
