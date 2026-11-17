package com.nexusgame.auth.dto;

import com.nexusgame.auth.domain.Rol;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RegistroAdminRequest(@NotNull @Valid RegistroRequest usuario, @NotNull Rol rol) { }
