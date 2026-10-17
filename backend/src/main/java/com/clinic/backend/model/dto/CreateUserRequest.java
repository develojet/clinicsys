package com.clinic.backend.model.dto;

import com.clinic.backend.model.enums.Role;
public record CreateUserRequest(String username, String email, String password, Role role) {}