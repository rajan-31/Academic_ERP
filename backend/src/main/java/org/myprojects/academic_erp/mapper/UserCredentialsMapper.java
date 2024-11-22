package org.myprojects.academic_erp.mapper;

import lombok.RequiredArgsConstructor;
import org.myprojects.academic_erp.dto.LoginRequest;
import org.myprojects.academic_erp.dto.LoginResponse;
import org.myprojects.academic_erp.entity.UserCredentials;
import org.myprojects.academic_erp.helper.EncryptionService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCredentialsMapper {
    private final EncryptionService encryptionService;

    public UserCredentials toUserCredentials(LoginRequest request) {
        return UserCredentials.builder()
                .email(request.email().toLowerCase())
                .passwordEncoded(encryptionService.passwordEncode(request.password()))
                .build();
    }

    public LoginResponse toLoginResponse(String jwtToken, String userType) {
        return new LoginResponse(jwtToken, userType);
    }
}
