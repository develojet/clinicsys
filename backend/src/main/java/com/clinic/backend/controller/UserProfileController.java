package com.clinic.backend.controller;

import com.clinic.backend.model.dto.FileResponse;
import com.clinic.backend.model.dto.UserProfileDto;
import com.clinic.backend.service.FileStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final FileStorageService fileStorageService;

    public UserProfileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponse> uploadAvatar(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String avatarUrl = fileStorageService.storeFile(file, "avatar");
        return ResponseEntity.ok(new FileResponse(avatarUrl));
    }

    @PostMapping(value = "/signature", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponse> uploadSignature(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String signatureUrl = fileStorageService.storeFile(file, "signature");
        return ResponseEntity.ok(new FileResponse(signatureUrl));
    }

    @DeleteMapping("/signature")
    public ResponseEntity<Void> deleteSignature() {
        // Option to trigger file deletion if existing URL is tracked
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody UserProfileDto userProfileDTO) {
        return ResponseEntity.ok(userProfileDTO);
    }
}