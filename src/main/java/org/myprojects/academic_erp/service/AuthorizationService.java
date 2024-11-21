package org.myprojects.academic_erp.service;

import lombok.RequiredArgsConstructor;
import org.myprojects.academic_erp.dto.LoginRequest;
import org.myprojects.academic_erp.entity.UserCredentials;
import org.myprojects.academic_erp.helper.EncryptionService;
import org.myprojects.academic_erp.helper.JWTHelper;
import org.myprojects.academic_erp.mapper.UserCredentialsMapper;
import org.myprojects.academic_erp.repo.UserCredentialsRepo;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthorizationService {
    private final UserCredentialsRepo userCredentialsRepo;

    private final UserCredentialsMapper userCredentialsMapper;

    private final EncryptionService encryptionService;
    private final JWTHelper jwtHelper;

    public UserCredentials getUserCredentials(String email) {
        return userCredentialsRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String createUserCredentials(LoginRequest request) {
        if(userCredentialsRepo.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        UserCredentials userCredentials = userCredentialsMapper.toUserCredentials(request);
        userCredentials.setUserType("employee");

        userCredentialsRepo.save(userCredentials);

        return "User created";
    }

    public String loginUser(LoginRequest request) {
        UserCredentials userCredentials = getUserCredentials(request.email().toLowerCase());

        if(!encryptionService.validatePassword(request.password(), userCredentials.getPasswordEncoded())) {
            return "Incorrect email or password";
        }

        return jwtHelper.generateToken(userCredentials.getEmail(), userCredentials.getUserType());
    }
}
