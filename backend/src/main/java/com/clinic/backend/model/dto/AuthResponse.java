package com.clinic.backend.model.dto;

public record AuthResponse(
        String token,
        UserDto user
) {}