package com.clinic.backend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer consultationId;

    @ManyToOne
    @JoinColumn(name = "processed_by_id")
    private User staff; // The staff who checked the patient in

    @ManyToOne
    @JoinColumn(name = "physician_id")
    private User doctor; // The doctor who finalized the notes

    @Column(precision = 10, scale = 2)
    private BigDecimal billing; // Better than Double for money
}
