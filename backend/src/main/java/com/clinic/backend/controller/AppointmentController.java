package com.clinic.backend.controller;

import com.clinic.backend.model.dto.AppointmentDto;
import com.clinic.backend.model.dto.AppointmentRequestDto;
import com.clinic.backend.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<List<AppointmentDto>> getAppointments(
            @RequestParam(required = false) Integer patientId
    ) {
        return ResponseEntity.ok(appointmentService.getAppointments(patientId));
    }

    @PostMapping
    public ResponseEntity<AppointmentDto> createAppointment(
            @RequestBody AppointmentRequestDto request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(appointmentService.createAppointment(request, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentDto> updateAppointment(
            @PathVariable Integer id,
            @RequestBody AppointmentRequestDto request
    ) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Integer id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
