package com.clinic.backend.model.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class AppointmentDto {
    private Integer id;
    private PatientDto patient;
    private LocalDateTime appointmentDate;
    private String status;
    private String reason;
    private String consultationType;
    private String createdBy;
    private Map<String, Object> consultationData;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public PatientDto getPatient() {
        return patient;
    }

    public void setPatient(PatientDto patient) {
        this.patient = patient;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getConsultationType() {
        return consultationType;
    }

    public void setConsultationType(String consultationType) {
        this.consultationType = consultationType;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Map<String, Object> getConsultationData() {
        return consultationData;
    }

    public void setConsultationData(Map<String, Object> consultationData) {
        this.consultationData = consultationData;
    }
}
