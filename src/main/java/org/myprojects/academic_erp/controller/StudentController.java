package org.myprojects.academic_erp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.myprojects.academic_erp.dto.StudentAdmissionRequest;
import org.myprojects.academic_erp.dto.StudentAdmissionResponse;
import org.myprojects.academic_erp.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/students")
public class StudentController {
    private final StudentService studentService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<StudentAdmissionResponse> addStudent(
            @RequestPart("data") @Valid StudentAdmissionRequest request,
            @RequestPart("photograph") MultipartFile photograph
    ) {
        System.out.println(request);
        StudentAdmissionResponse response = studentService.addStudent(request, photograph);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
