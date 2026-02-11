package com.clinic.backend.model;

import com.clinic.backend.model.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "clinic_users")
@Data // Lombok annotation
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;
}
