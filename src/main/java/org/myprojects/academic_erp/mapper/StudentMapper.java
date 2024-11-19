package org.myprojects.academic_erp.mapper;

import org.myprojects.academic_erp.dto.StudentAdmissionRequest;
import org.myprojects.academic_erp.dto.StudentAdmissionResponse;
import org.myprojects.academic_erp.entity.Domain;
import org.myprojects.academic_erp.entity.Student;
import org.springframework.stereotype.Service;

@Service
public class StudentMapper {
    public Student studentAdmissionRequestToStudent(StudentAdmissionRequest request, Domain domain) {
        return Student.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
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
}
