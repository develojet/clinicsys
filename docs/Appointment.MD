# Appointment Management System - Feature Specification & Blueprint

This document outlines the architecture, backend entities, API controller logic, and frontend components needed to
implement full **Appointment Management** integrated with automatic **Patient Creation**.

---

## 1. Backend Architecture (Spring Boot & JPA)

### 1.1 Database Schema & Entity (`Appointment.java`)

Create or update the JPA entity for appointments. It maintains a many-to-one relationship with the `Patient` entity.

```java
package com.clinicsys.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    @Column(nullable = false)
    private String status; // e.g., SCHEDULED, COMPLETED, CANCELLED

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "created_by")
    private String createdBy; // Username or ID of staff/doctor/admin

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
```

---

### 1.2 Data Transfer Object (`AppointmentRequestDTO.java`)

This DTO supports creating appointments for existing patients **OR** automatically creating a new patient inline when
`patientId` is omitted.

```java
package com.clinicsys.dto;

import java.time.LocalDateTime;

public class AppointmentRequestDTO {
    private Long patientId; // Optional: provided if selecting existing patient

    // Fields for dynamic patient creation (used when patientId is null)
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String gender;
    private String dateOfBirth;

    // Appointment details
    private LocalDateTime appointmentDate;
    private String reason;
    private String status;

    // Getters and Setters
    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
```

---

### 1.3 Spring Data Repository (`AppointmentRepository.java`)

```java
package com.clinicsys.repository;

import com.clinicsys.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
}
```

---

### 1.4 REST Controller (`AppointmentController.java`)

```java
package com.clinicsys.controller;

import com.clinicsys.dto.AppointmentRequestDTO;
import com.clinicsys.model.Appointment;
import com.clinicsys.model.Patient;
import com.clinicsys.repository.AppointmentRepository;
import com.clinicsys.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequestDTO dto) {
        Patient patient;

        // Automatically create a new patient if no existing patient ID is passed
        if (dto.getPatientId() != null) {
            patient = patientRepository.findById(dto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + dto.getPatientId()));
        } else {
            Patient newPatient = new Patient();
            newPatient.setFirstName(dto.getFirstName());
            newPatient.setLastName(dto.getLastName());
            newPatient.setPhone(dto.getPhone());
            newPatient.setEmail(dto.getEmail());
            newPatient.setGender(dto.getGender());
            if (dto.getDateOfBirth() != null && !dto.getDateOfBirth().isEmpty()) {
                newPatient.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth()));
            }
            patient = patientRepository.save(newPatient);
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setReason(dto.getReason());
        appointment.setStatus(dto.getStatus() != null ? dto.getStatus() : "SCHEDULED");

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return ResponseEntity.ok(savedAppointment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody AppointmentRequestDTO dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (dto.getAppointmentDate() != null) {
            appointment.setAppointmentDate(dto.getAppointmentDate());
        }
        if (dto.getReason() != null) {
            appointment.setReason(dto.getReason());
        }
        if (dto.getStatus() != null) {
            appointment.setStatus(dto.getStatus());
        }

        Appointment updated = appointmentRepository.save(appointment);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        appointmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
```

---

## 2. Frontend Implementation (React & Tailwind CSS)

### 2.1 API Service (`appointmentService.js`)

```javascript
import api from '../api/axios';

export const appointmentService = {
    getAll: async () => {
        const response = await api.get('/appointments');
        return response.data;
    },
    create: async (appointmentData) => {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
    },
    update: async (id, appointmentData) => {
        const response = await api.put(`/appointments/${id}`, appointmentData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    }
};
```

---

### 2.2 Appointment Management View (`Appointments.jsx`)

```jsx
import React, {useState, useEffect} from 'react';
import {appointmentService} from '../services/appointmentService';
import {patientService} from '../services/patientService';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewPatient, setIsNewPatient] = useState(false);

    const [formData, setFormData] = useState({
        patientId: '',
        firstName: '',
        lastName: '',
        phone: '',
        appointmentDate: '',
        reason: '',
        status: 'SCHEDULED'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const appts = await appointmentService.getAll();
            const pats = await patientService.getAll();
            setAppointments(appts);
            setPatients(pats);
        } catch (err) {
            console.error("Failed to load appointment data", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await appointmentService.create(formData);
            setIsModalOpen(false);
            loadData();
            setFormData({
                patientId: '',
                firstName: '',
                lastName: '',
                phone: '',
                appointmentDate: '',
                reason: '',
                status: 'SCHEDULED'
            });
        } catch (err) {
            console.error("Error saving appointment", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            await appointmentService.delete(id);
            loadData();
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + New Appointment
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appt) => (
                        <tr key={appt.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {appt.patient?.firstName} {appt.patient?.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(appt.appointmentDate).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.reason}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appt.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {appt.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleDelete(appt.id)}
                                        className="text-red-600 hover:text-red-900 ml-4">Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">Create Appointment</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={isNewPatient}
                                        onChange={(e) => setIsNewPatient(e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Patient not registered yet (Create New)</span>
                                </label>
                            </div>

                            {!isNewPatient ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Select Existing
                                        Patient</label>
                                    <select
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        value={formData.patientId}
                                        onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                                        required={!isNewPatient}
                                    >
                                        <option value="">-- Choose Patient --</option>
                                        {patients.map(p => (
                                            <option key={p.id}
                                                    value={p.id}>{p.firstName} {p.lastName} ({p.phone})</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="space-y-3 border-t border-b py-3">
                                    <p className="text-xs font-semibold text-blue-600 uppercase">New Patient Details</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text" placeholder="First Name" required
                                            className="border p-2 rounded text-sm w-full"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        />
                                        <input
                                            type="text" placeholder="Last Name" required
                                            className="border p-2 rounded text-sm w-full"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        />
                                    </div>
                                    <input
                                        type="text" placeholder="Phone Number" required
                                        className="border p-2 rounded text-sm w-full"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Appointment Date &
                                    Time</label>
                                <input
                                    type="datetime-local" required
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    value={formData.appointmentDate}
                                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Reason / Notes</label>
                                <textarea
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Save Appointment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
```