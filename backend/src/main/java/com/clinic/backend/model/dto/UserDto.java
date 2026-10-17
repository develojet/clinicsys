package com.clinic.backend.model.dto;

import com.clinic.backend.model.enums.Role;
public record UserDto(Integer userId, String username, String email, Role role) {}