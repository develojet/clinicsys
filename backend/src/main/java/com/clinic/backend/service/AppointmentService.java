package com.clinic.backend.service;

import com.clinic.backend.model.Appointment;
import com.clinic.backend.model.Patient;
import com.clinic.backend.model.dto.AppointmentDto;
import com.clinic.backend.model.dto.AppointmentRequestDto;
import com.clinic.backend.model.dto.PatientDto;
import com.clinic.backend.repository.AppointmentRepository;
import com.clinic.backend.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AppointmentService {
    private static final List<String> ALLOWED_STATUSES = List.of("SCHEDULED", "COMPLETED", "CANCELLED");

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final PatientService patientService;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            PatientService patientService
    ) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.patientService = patientService;
    }

    @Transactional(readOnly = true)
    public List<AppointmentDto> getAppointments(Integer patientId) {
        List<Appointment> appointments = patientId == null
                ? appointmentRepository.findAllByOrderByAppointmentDateAsc()
                : appointmentRepository.findByPatient_IdOrderByAppointmentDateAsc(patientId);
        return appointments.stream().map(this::toDto).toList();
    }

    @Transactional
    public AppointmentDto createAppointment(AppointmentRequestDto request, String createdBy) {
        validateAppointmentDate(request);
        Patient patient = resolvePatient(request);
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setReason(request.getReason());
        appointment.setConsultationType(request.getConsultationType());
        appointment.setStatus(normalizeStatus(request.getStatus()));
        appointment.setCreatedBy(createdBy);
        return toDto(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentDto updateAppointment(Integer id, AppointmentRequestDto request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        if (request.getAppointmentDate() != null) {
            appointment.setAppointmentDate(request.getAppointmentDate());
        }
        if (request.getReason() != null) {
            appointment.setReason(request.getReason());
        }
        if (request.getConsultationType() != null) {
            appointment.setConsultationType(request.getConsultationType());
        }
        if (request.getStatus() != null) {
            appointment.setStatus(normalizeStatus(request.getStatus()));
        }
        if (request.getConsultationData() != null) {
            appointment.setConsultationData(request.getConsultationData());
        }
        return toDto(appointmentRepository.save(appointment));
    }

    @Transactional
    public void deleteAppointment(Integer id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found");
        }
        appointmentRepository.deleteById(id);
    }

    private Patient resolvePatient(AppointmentRequestDto request) {
        if (request.getPatientId() != null) {
            return patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        }

        if (isBlank(request.getFirstName()) || isBlank(request.getLastName()) || isBlank(request.getPhone())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "First name, last name, and phone are required when creating a new patient"
            );
        }

        PatientDto patientDto = new PatientDto();
        patientDto.setFirstName(request.getFirstName().trim());
        patientDto.setGivenName(request.getFirstName().trim());
        patientDto.setLastName(request.getLastName().trim());
        patientDto.setFamilyName(request.getLastName().trim());
        patientDto.setMobileNumber(request.getPhone().trim());
        patientDto.setEmail(request.getEmail());
        patientDto.setSex(request.getGender());
        patientDto.setBirthDate(request.getDateOfBirth());
        PatientDto savedPatient = patientService.createPatient(patientDto);
        return patientRepository.findById(savedPatient.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Patient could not be created"));
    }

    private void validateAppointmentDate(AppointmentRequestDto request) {
        if (request.getAppointmentDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointment date is required");
        }
    }

    private String normalizeStatus(String status) {
        String normalized = isBlank(status) ? "SCHEDULED" : status.trim().toUpperCase();
        if (!ALLOWED_STATUSES.contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported appointment status");
        }
        return normalized;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private AppointmentDto toDto(Appointment appointment) {
        PatientDto patientDto = new PatientDto();
        Patient patient = appointment.getPatient();
        patientDto.setId(patient.getId());
        patientDto.setPatientCode(patient.getPatientCode());
        patientDto.setFirstName(patient.getFirstName());
        patientDto.setLastName(patient.getLastName());
        patientDto.setGivenName(patient.getGivenName());
        patientDto.setFamilyName(patient.getFamilyName());
        patientDto.setMobileNumber(patient.getMobileNumber());

        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getAppointmentId());
        dto.setPatient(patientDto);
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setStatus(appointment.getStatus());
        dto.setReason(appointment.getReason());
        dto.setConsultationType(appointment.getConsultationType());
        dto.setCreatedBy(appointment.getCreatedBy());
        dto.setConsultationData(appointment.getConsultationData());
        return dto;
    }
}
