package com.clinic.backend.service;

import com.clinic.backend.model.Patient;
import com.clinic.backend.model.dto.PatientDto;
import com.clinic.backend.repository.PatientRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<PatientDto> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PatientDto getPatientById(Integer id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
        return convertToDto(patient);
    }

    public PatientDto getPatientByCode(String code) {
        Patient patient = patientRepository.findByPatientCode(code)
                .orElseThrow(() -> new RuntimeException("Patient not found with code: " + code));
        return convertToDto(patient);
    }

    public PatientDto createPatient(PatientDto dto) {
        Patient patient = new Patient();
        BeanUtils.copyProperties(dto, patient);
        patient.setId(null);

        if (patient.getPatientCode() == null || patient.getPatientCode().isBlank()) {
            String patientCode;
            do {
                patientCode = "PX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            } while (patientRepository.existsByPatientCode(patientCode));
            patient.setPatientCode(patientCode);
        }

        Patient savedPatient = patientRepository.save(patient);
        return convertToDto(savedPatient);
    }

    public PatientDto updatePatient(Integer id, PatientDto dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));

        BeanUtils.copyProperties(dto, patient, "id", "patientCode");
        Patient updatedPatient = patientRepository.save(patient);
        return convertToDto(updatedPatient);
    }

    public void deletePatient(Integer id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
        patientRepository.delete(patient);
    }

    private PatientDto convertToDto(Patient patient) {
        PatientDto dto = new PatientDto();
        BeanUtils.copyProperties(patient, dto);
        return dto;
    }
}