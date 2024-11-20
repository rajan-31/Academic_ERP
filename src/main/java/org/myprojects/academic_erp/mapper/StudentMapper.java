package org.myprojects.academic_erp.mapper;

import org.myprojects.academic_erp.dto.StudentAdmissionRequest;
import org.myprojects.academic_erp.dto.StudentAdmissionResponse;
import org.myprojects.academic_erp.dto.StudentModificationRequest;
import org.myprojects.academic_erp.dto.StudentResponse;
import org.myprojects.academic_erp.entity.Domain;
import org.myprojects.academic_erp.entity.Placement;
import org.myprojects.academic_erp.entity.Specialization;
import org.myprojects.academic_erp.entity.Student;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentMapper {
    public StudentResponse toStudentResponse(Student student) {
        return new StudentResponse(
                student.getStudentId(),
                student.getRollNumber(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getPhotographPath(),
                student.getCgpa(),
                student.getTotalCredits(),
                student.getGraduationYear(),
                student.getDomain() != null ? student.getDomain().getDomainId() : null,
                student.getSpecialization() != null ? student.getSpecialization().getSpecializationId() : null,
                student.getPlacement() != null ? student.getPlacement().getId() : null
        );
    }

    public List<StudentResponse> toStudentResponseList(List<Student> students) {
        return students.stream()
                .map(this::toStudentResponse)
                .toList();
    }

    // ======================================================

    public Student studentAdmissionRequestToStudent(StudentAdmissionRequest request, Domain domain) {
        return Student.builder()
                .firstName(request.firstName().trim().toLowerCase())
                .lastName(request.lastName().trim().toLowerCase())
                .domain(domain)
                .build();
    }

    public StudentAdmissionResponse toStudentAdmissionResponse(Student student) {
        return new StudentAdmissionResponse(
                student.getStudentId(),
                student.getRollNumber(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getPhotographPath(),
                student.getDomain().getDomainId()
        );
    }

    // ======================================================

    public Student studentModificationRequestToStudent(
            StudentModificationRequest request,
            Student existingStudent,
            Domain domain,
            Specialization specialization,
            Placement placement
    ) {
        return Student.builder()
                .studentId(existingStudent.getStudentId()) // Preserve existing ID
                .rollNumber(existingStudent.getRollNumber())
                .firstName(request.firstName() != null ? request.firstName().trim().toLowerCase() : existingStudent.getFirstName())
                .lastName(request.lastName() != null ? request.lastName().trim().toLowerCase() : existingStudent.getLastName())
                .email(existingStudent.getEmail())
                .photographPath(existingStudent.getPhotographPath()) // Preserve photographPath
                .cgpa(request.cgpa() != null ? request.cgpa() : existingStudent.getCgpa())
                .totalCredits(request.totalCredits() != null ? request.totalCredits() : existingStudent.getTotalCredits())
                .graduationYear(request.graduationYear() != null ? request.graduationYear() : existingStudent.getGraduationYear())
                .domain(domain != null ? domain : existingStudent.getDomain()) // Update if new domain provided
                .specialization(specialization != null ? specialization : existingStudent.getSpecialization())
                .placement(placement != null ? placement : existingStudent.getPlacement())
                .build();
    }
}
