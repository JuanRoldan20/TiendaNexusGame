package com.nexusgame.auth.client;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.PutExchange;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

/** Cliente declarativo hacia users-service (llamada directa, no pasa por el gateway). */
@HttpExchange("/internal/usuarios")
public interface UsuariosClient {

    @PostExchange
    void crearPerfil(@RequestBody CrearPerfilRequest request);

    @PutExchange("/{id}/rol")
    void actualizarRol(@PathVariable Long id, @RequestBody RolRequest request);

    @DeleteExchange("/{id}")
    void desactivarPerfil(@PathVariable Long id);

    record RolRequest(String rol) { }

}
