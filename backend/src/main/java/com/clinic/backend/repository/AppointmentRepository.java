package com.clinic.backend.repository;

import com.clinic.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findAllByOrderByAppointmentDateAsc();

    List<Appointment> findByPatient_IdOrderByAppointmentDateAsc(Integer patientId);
}
