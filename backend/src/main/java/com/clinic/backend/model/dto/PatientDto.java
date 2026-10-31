package com.clinic.backend.model.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientDto {
    private Integer id;
    private String patientCode;
    private String photoUrl;
    private String firstName;
    private String lastName;
    private String familyName;
    private String givenName;
    private String middleName;
    private LocalDate birthDate;
    private Integer age;
    private String sex;
    private String status;
    private String mobileNumber;
    private String email;
    private String address;
    private String employerAddress;
    private String occupation;
    private String spouseName;
    private String insurance;
    private String hmo;
    private String philhealthNo;
}