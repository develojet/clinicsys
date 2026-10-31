package com.clinic.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Integer id;

    @Column(unique = true, nullable = false)
    private String patientCode; // e.g., "PX-1021"

    private String photoUrl;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "family_name")
    private String familyName;

    @Column(name = "given_name")
    private String givenName;

    private String middleName;

    private LocalDate birthDate;

    private Integer age;

    private String sex; // Female, Male, etc.

    private String status; // Single, Married, Divorced, etc.

    private String mobileNumber;

    private String email;

    @Column(length = 500)
    private String address;

    @Column(length = 500)
    private String employerAddress;

    private String occupation;

    private String spouseName;

    private String insurance;

    private String hmo;

    private String philhealthNo;

    @PrePersist
    @PreUpdate
    public void syncNames() {
        if ((firstName == null || firstName.isBlank()) && givenName != null && !givenName.isBlank()) {
            firstName = givenName;
        }
        if ((lastName == null || lastName.isBlank()) && familyName != null && !familyName.isBlank()) {
            lastName = familyName;
        }
        if ((givenName == null || givenName.isBlank()) && firstName != null && !firstName.isBlank()) {
            givenName = firstName;
        }
        if ((familyName == null || familyName.isBlank()) && lastName != null && !lastName.isBlank()) {
            familyName = lastName;
        }
    }
}