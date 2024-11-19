package org.myprojects.academic_erp.service;

import lombok.RequiredArgsConstructor;
import org.myprojects.academic_erp.dto.StudentAdmissionRequest;
import org.myprojects.academic_erp.dto.StudentAdmissionResponse;
import org.myprojects.academic_erp.entity.Domain;
import org.myprojects.academic_erp.entity.Student;
import org.myprojects.academic_erp.helper.FileUploadHelper;
import org.myprojects.academic_erp.mapper.StudentMapper;
import org.myprojects.academic_erp.repo.DomainRepo;
import org.myprojects.academic_erp.repo.PlacementRepo;
import org.myprojects.academic_erp.repo.SpecializationRepo;
import org.myprojects.academic_erp.repo.StudentRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
import java.util.Random;
import java.util.stream.IntStream;

import static java.lang.String.format;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepo studentRepo;
    private final DomainRepo domainRepo;
    private final SpecializationRepo specializationRepo;
    private final PlacementRepo placementRepo;

    private final StudentMapper studentMapper;
    private final FileUploadHelper fileUploadHelper;

    private String generateRollNumber(Domain domain) {
        String domainCode = domain.getCode();
        Integer batch = domain.getBatch();

        // Student with same domain
        Long count = studentRepo.countByDomain(domain);

        // Domains with same code
        List<Domain> domainsWithSameCode = domainRepo.getDomainByCode(domainCode);
        int idx = IntStream.range(0, domainsWithSameCode.size())
                .filter(i -> Objects.equals(
                        domainsWithSameCode.get(i).getDomainId(), domain.getDomainId())
                )
                .findFirst()
                .orElse(10);

        // like IIITB has MTech CSE => MT2024001 to 200,
        //                MTech ECE => MT2024201 to 400
        //               iMTech CSE =>iMT2024001 to 200
        //               iMTech ECE =>iMT2024201 to 400

        return domainCode + batch + format("%03d", idx * 200L + count + 1);
    }


    private String generateUniqueEmail(String firstName, String lastName) {
        String baseEmail = lastName + "." + firstName;
        String emailDomain = "iiitb.ac.in";
        String email = baseEmail + "@" + emailDomain;

        // Fetch all emails with a similar prefix
        List<String> existingEmails = studentRepo.findEmailsWithPrefix(baseEmail);

        // If no email matches, return the default email
        if (!existingEmails.contains(email)) {
            return email;
        }

        // ======================================================
        // Generate a unique email by appending a random number
        Random random = new Random();
        int attempt = 0;
        String uniqueEmail;
        do {
            int randomNum = 100 + random.nextInt(900); // Random 3-digit number
            uniqueEmail = baseEmail + randomNum + "@" + emailDomain;
            attempt++;
        } while (existingEmails.contains(uniqueEmail) && attempt < 100);

        // Handle cases where attempts exceed limits
        if (attempt == 100) {
            throw new IllegalStateException("Unable to generate a unique email after 100 attempts");
        }

        return uniqueEmail;
    }

    public StudentAdmissionResponse addStudent(
            StudentAdmissionRequest request, MultipartFile photograph
    ) {
        // To generate roll number, construct Student
        Domain domain = domainRepo.findById(request.domain())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid domain ID: " + request.domain())
                );

        Student student = studentMapper.studentAdmissionRequestToStudent(request, domain);

        // Generate roll number and email
        String rollNumber = generateRollNumber(domain);
        student.setRollNumber(rollNumber);
        String email = generateUniqueEmail(student.getFirstName(), student.getLastName());
        student.setEmail(email);

        // Save photograph to file system and get path
        String photographPath = fileUploadHelper.savePhotograph(photograph, rollNumber);
        student.setPhotographPath(photographPath);

        studentRepo.save(student);
        return studentMapper.toStudentAdmissionResponse(student);
    }
}
