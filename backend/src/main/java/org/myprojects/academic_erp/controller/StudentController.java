package org.myprojects.academic_erp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.myprojects.academic_erp.dto.StudentAdmissionRequest;
import org.myprojects.academic_erp.dto.StudentAdmissionResponse;
import org.myprojects.academic_erp.dto.StudentModificationRequest;
import org.myprojects.academic_erp.dto.StudentResponse;
import org.myprojects.academic_erp.helper.JWTHelper;
import org.myprojects.academic_erp.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/students")
public class StudentController {
    private final StudentService studentService;

    private final JWTHelper jwtHelper;

    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAllStudents(
            @RequestHeader(value = "Authorization") String authHeader
    ) {
        if(!jwtHelper.validateAuthorizationHeader(authHeader, List.of("employee"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.status(HttpStatus.OK).body(studentService.getStudents());
    }

    @GetMapping("/{student_id}")
    public ResponseEntity<StudentResponse> getStudent(
            @RequestHeader(value = "Authorization") String authHeader,
            @PathVariable("student_id") Long studentId
    ) {
        if(!jwtHelper.validateAuthorizationHeader(authHeader, List.of("student", "employee"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.status(HttpStatus.OK).body(studentService.getStudent(studentId));
    }

    @GetMapping("/email")
    public ResponseEntity<StudentResponse> getStudentByEmail(
            @RequestHeader(value = "Authorization") String authHeader
    ) {
        if(!jwtHelper.validateAuthorizationHeader(authHeader, List.of("student", "employee"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = jwtHelper.extractEmail(jwtHelper.authHeaderToToken(authHeader));

        return ResponseEntity.status(HttpStatus.OK).body(studentService.getStudentByEmail(email));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<StudentAdmissionResponse> addStudent(
            @RequestHeader(value = "Authorization") String authHeader,
            @RequestPart("data") @Valid StudentAdmissionRequest request,
            @RequestPart(value = "photograph", required = false) MultipartFile photograph
    ) {
        if(!jwtHelper.validateAuthorizationHeader(authHeader, List.of("employee"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addStudent(request, photograph));
    }

    @PutMapping(path = "/{student_id}", consumes = "multipart/form-data")
    public ResponseEntity<StudentResponse> updateStudent(
            @RequestHeader(value = "Authorization") String authHeader,
            @PathVariable("student_id") Long studentId,
            @RequestPart(name = "data", required = false) @Valid StudentModificationRequest request,
            @RequestPart(name = "photograph", required = false) MultipartFile photograph
    ) {
        if(!jwtHelper.validateAuthorizationHeader(authHeader, List.of("student", "employee"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtHelper.authHeaderToToken(authHeader);

        return ResponseEntity.status(HttpStatus.OK).body(studentService.updateStudent(
                request, photograph, studentId,
                jwtHelper.extractUserType(token), jwtHelper.extractEmail(token))
        );
    }

    @DeleteMapping("/{student_id}")
    public ResponseEntity<String> deleteStudent(
            @RequestHeader(value = "Authorization") String authHeader,
            @PathVariable("student_id") Long studentId
    ) {
        if(!jwtHelper.validateAuthorizationHeader(authHeader, List.of("student", "employee"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtHelper.authHeaderToToken(authHeader);

        return ResponseEntity.status(HttpStatus.OK).body(studentService.deleteStudent(
                studentId,
                jwtHelper.extractUserType(token), jwtHelper.extractEmail(token))
        );
    }
}
