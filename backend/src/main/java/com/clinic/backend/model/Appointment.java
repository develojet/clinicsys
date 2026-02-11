package com.clinic.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appointmentId;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private User staff; // The user who created the appointment

    private LocalDateTime appointmentDate;
    private String status; // Pending, Confirmed, Cancelled
}
