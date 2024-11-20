package org.myprojects.academic_erp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.myprojects.academic_erp.dto.StudentAdmissionRequest;
import org.myprojects.academic_erp.dto.StudentAdmissionResponse;
import org.myprojects.academic_erp.dto.StudentModificationRequest;
import org.myprojects.academic_erp.dto.StudentResponse;
import org.myprojects.academic_erp.entity.Student;
import org.myprojects.academic_erp.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/students")
public class StudentController {
    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        return ResponseEntity.status(HttpStatus.OK).body(studentService.getStudents());
    }

    @GetMapping("/{student_id}")
    public ResponseEntity<StudentResponse> getStudent(@PathVariable("student_id") Long studentId) {
        return ResponseEntity.status(HttpStatus.OK).body(studentService.getStudent(studentId));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<StudentAdmissionResponse> addStudent(
            @RequestPart("data") @Valid StudentAdmissionRequest request,
            @RequestPart("photograph") MultipartFile photograph
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addStudent(request, photograph));
    }

    @PutMapping(path = "/{student_id}", consumes = "multipart/form-data")
    public ResponseEntity<String> updateStudent(
            @PathVariable("student_id") Long studentId,
            @RequestPart(name = "data", required = false) @Valid StudentModificationRequest request,
            @RequestPart(name = "photograph", required = false) MultipartFile photograph
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(studentService.updateStudent(request, photograph, studentId));
    }

    @DeleteMapping("/{student_id}")
    public ResponseEntity<String> deleteStudent(@PathVariable("student_id") Long studentId) {
        return ResponseEntity.status(HttpStatus.OK).body(studentService.deleteStudent(studentId));
    }
}
