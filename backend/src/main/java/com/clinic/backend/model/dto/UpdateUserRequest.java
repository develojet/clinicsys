package com.clinic.backend.model.dto;

import com.clinic.backend.model.enums.Role;
public record UpdateUserRequest(String email, Role role, String password) {}