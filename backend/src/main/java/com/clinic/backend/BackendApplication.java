package com.clinic.backend;

import com.clinic.backend.model.User;
import com.clinic.backend.model.enums.Role;
import com.clinic.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }


    @Bean
    CommandLineRunner initDatabase(UserRepository repository, PasswordEncoder encoder) {
        return args -> {
            // Check if any admin exists
            if (repository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                // This correctly hashes the password "adminpass"
                admin.setPasswordHash(encoder.encode("adminpass"));
                admin.setEmail("admin@clinic.com");
                admin.setRole(Role.ADMIN);
                repository.save(admin);
                System.out.println(">>> Initial Admin Account Created: admin / admin123");
            }
        };
    }
}
