package org.myprojects.academic_erp.service;

import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.myprojects.academic_erp.dto.StudentAdmissionRequest;
import org.myprojects.academic_erp.dto.StudentAdmissionResponse;
import org.myprojects.academic_erp.dto.StudentModificationRequest;
import org.myprojects.academic_erp.dto.StudentResponse;
import org.myprojects.academic_erp.entity.*;
import org.myprojects.academic_erp.exception.AccessDeniedException;
import org.myprojects.academic_erp.exception.StudentDataInvalidException;
import org.myprojects.academic_erp.exception.StudentNotFoundException;
import org.myprojects.academic_erp.helper.EncryptionService;
import org.myprojects.academic_erp.helper.FileUploadHelper;
import org.myprojects.academic_erp.mapper.StudentMapper;
import org.myprojects.academic_erp.repo.*;
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
    private final UserCredentialsRepo userCredentialsRepo;

    private final StudentMapper studentMapper;
    private final FileUploadHelper fileUploadHelper;

    private final EncryptionService encryptionService;

    private static final Logger LOGGER = LogManager.getLogger();

    // ======================================================

    public List<StudentResponse> getStudents() {
        return studentMapper.toStudentResponseList(studentRepo.findAll());
    }

    // ======================================================

    public StudentResponse getStudent(Long studentId) {
        return studentMapper.toStudentResponse(studentRepo.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(
                        format("Student with id %s not found", studentId)
                ))
        );
    }

    // ======================================================

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
        long nextCountInDomain = idx * 200L + count + 1;

        // ======================================================

        Student lastStudentInDomain = studentRepo.findFirstByDomainOrderByRollNumberDesc(domain);
        if(lastStudentInDomain != null) {
            nextCountInDomain = Long.parseLong(
                    lastStudentInDomain.getRollNumber()
                            .replace(domainCode+batch, "")
            ) + 1;
        }

        // ======================================================

        // like IIITB has MTech CSE => MT2024001 to 200,
        //                MTech ECE => MT2024201 to 400
        //               iMTech CSE =>iMT2024001 to 200
        //               iMTech ECE =>iMT2024201 to 400

        return domainCode + batch + format("%03d", nextCountInDomain);
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
        if(photograph != null && !photograph.isEmpty()) {
            String photographPath = fileUploadHelper.savePhotograph(photograph, rollNumber);
            student.setPhotographPath(photographPath);
        }

        String generatedPassword = encryptionService.generateSecurePassword();
        userCredentialsRepo.save(studentMapper.toUserCredentials(
                student, encryptionService.passwordEncode(generatedPassword))
        );
        studentRepo.save(student);
        return studentMapper.toStudentAdmissionResponse(student);
    }

    // ======================================================

    public String updateStudent(
            StudentModificationRequest request, MultipartFile photograph,
            Long studentId, String loggedInUserType, String loggedInEmail
    ) {
        Student existingStudent = studentRepo.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(
                        format("Student %s not found", studentId)
                ));

        if(!loggedInUserType.equals("employee") && !loggedInEmail.equals(existingStudent.getEmail())) {
            throw new AccessDeniedException("Unauthorized user");
        }

        Domain domain = request.domain() != null ?
                domainRepo.findById(request.domain())
                        .orElseThrow(() -> new StudentDataInvalidException("Invalid domain"))
                : existingStudent.getDomain();
        Specialization specialization = request.specialization() != null ?
                specializationRepo.findById(request.specialization())
                        .orElseThrow(() -> new StudentDataInvalidException("Invalid specialization"))
                : existingStudent.getSpecialization();
        Placement placement = request.placement() != null ?
                placementRepo.findById(request.placement())
                        .orElseThrow(() -> new StudentDataInvalidException("Invalid placement"))
                : existingStudent.getPlacement();

        Student modifiedStudent = studentMapper.studentModificationRequestToStudent(
                request, existingStudent, domain, specialization, placement
        );

        if(request.rollNumberModify() != null && request.rollNumberModify()) {
            modifiedStudent.setRollNumber(generateRollNumber(domain));
        }
        if(photograph != null && !photograph.isEmpty()) {
            String photographPath = fileUploadHelper.savePhotograph(photograph, modifiedStudent.getRollNumber());
            modifiedStudent.setPhotographPath(photographPath);
        }
        if(
                (request.firstName() != null && !request.firstName().isEmpty()) ||
                (request.lastName() != null &&  !request.lastName().isEmpty()) ||
                (request.emailModify() != null && request.emailModify())
        ) {
            String newEmail = generateUniqueEmail(modifiedStudent.getFirstName(), modifiedStudent.getLastName());

            UserCredentials userCredentials = userCredentialsRepo.findByEmail(existingStudent.getEmail())
                            .orElseThrow(() -> new StudentDataInvalidException("Invalid email"));
            // this will update email, no need to call save()
            userCredentials.setEmail(newEmail);

            modifiedStudent.setEmail(newEmail);
        }

        studentRepo.save(modifiedStudent);

        return "Student updated successfully";
    }

    // ======================================================

    public String deleteStudent(
            Long studentId, String
            loggedInUserType, String loggedInEmail
    ) {
        // we will also delete email from email service provider

        Student student =  studentRepo.findById(studentId).orElseThrow(
                () -> new StudentNotFoundException(format("Student with id %s not found", studentId))
        );

        if(!loggedInUserType.equals("employee") && !loggedInEmail.equals(student.getEmail())) {
            throw new AccessDeniedException("Unauthorized user");
        }

        // delete photo
        String photographPath = student.getPhotographPath();
        if(!fileUploadHelper.deletePhotograph(photographPath)) {
            LOGGER.error("Failed to delete photograph");
        }

        String email = student.getEmail();
        userCredentialsRepo.deleteByEmail(email);
        studentRepo.deleteById(studentId);

        return "Student deleted successfully";
    }
}
