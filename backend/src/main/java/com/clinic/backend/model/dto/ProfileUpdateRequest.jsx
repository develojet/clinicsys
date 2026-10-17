package com.example.clinic.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String fullName;
    private String email;
    private String licenseNumber;
    private String specialization;
    private String currentPassword;
    private String newPassword;
}