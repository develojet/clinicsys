package com.clinic.backend;

import com.clinic.backend.model.Patient;
import com.clinic.backend.model.User;
import com.clinic.backend.model.enums.Role;
import com.clinic.backend.repository.PatientRepository;
import com.clinic.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }


//    @Bean
//    CommandLineRunner initDatabase(UserRepository repository, PasswordEncoder encoder) {
//        return args -> {
//            // Check if any admin exists
//            if (repository.findByUsername("admin").isEmpty()) {
//                User admin = new User();
//                admin.setUsername("admin");
//                // This correctly hashes the password "adminpass"
//                admin.setPasswordHash(encoder.encode("adminpass"));
//                admin.setEmail("admin@clinic.com");
//                admin.setRole(Role.ADMIN);
//                repository.save(admin);
//                System.out.println(">>> Initial Admin Account Created: admin / admin123");
//            }
//        };
//    }

    @Bean
    CommandLineRunner seedPatients(PatientRepository patientRepository) {
        return args -> {
            if (patientRepository.count() == 0) {
                List<Patient> samplePatients = List.of(
                        Patient.builder()
                                .patientCode("PX-1001")
                                .firstName("Maria")
                                .lastName("Cruz")
                                .familyName("Cruz")
                                .givenName("Maria")
                                .middleName("Dela")
                                .birthDate(java.time.LocalDate.of(1992, 5, 12))
                                .age(33)
                                .sex("Female")
                                .status("Pregnant")
                                .mobileNumber("09171234567")
                                .address("123 Sampaloc Street, Manila")
                                .occupation("Teacher")
                                .spouseName("Rico Cruz")
                                .insurance("Maxicare")
                                .hmo("Maxicare")
                                .philhealthNo("PH-1001")
                                .build(),
                        Patient.builder()
                                .patientCode("PX-1002")
                                .firstName("Gabriel")
                                .lastName("Santos")
                                .familyName("Santos")
                                .givenName("Gabriel")
                                .middleName("M.")
                                .birthDate(java.time.LocalDate.of(1988, 10, 20))
                                .age(37)
                                .sex("Male")
                                .status("Follow-up")
                                .mobileNumber("09187654321")
                                .address("45 Makati Ave, Makati")
                                .occupation("Engineer")
                                .insurance("PhilHealth")
                                .hmo("MediLink")
                                .philhealthNo("PH-1002")
                                .build(),
                        Patient.builder()
                                .patientCode("PX-1003")
                                .firstName("Leonor")
                                .lastName("Rivera")
                                .familyName("Rivera")
                                .givenName("Leonor")
                                .birthDate(java.time.LocalDate.of(1967, 4, 11))
                                .age(59)
                                .sex("Female")
                                .status("Hypertension")
                                .mobileNumber("09223344556")
                                .address("9 Baguio Road, Quezon City")
                                .occupation("Retired")
                                .insurance("PhilHealth")
                                .hmo("SunLife")
                                .philhealthNo("PH-1003")
                                .build()
                );

                patientRepository.saveAll(samplePatients);
                System.out.println(">>> Seeded " + samplePatients.size() + " sample patients <<<");
            }
        };
    }

    @Bean
    CommandLineRunner resetAllPasswords(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String encodedPassword = passwordEncoder.encode("P@ssw0rd");
            List<User> users = userRepository.findAll();
            users.forEach(user -> user.setPasswordHash(encodedPassword));
            userRepository.saveAll(users);
            System.out.println(">>> RESET " + users.size() + " USERS TO PASSWORD: P@ssw0rd <<<");
        };
    }
}
