package org.myprojects.academic_erp.helper;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EncryptionService {
    private final PasswordEncoder passwordEncoder;

    public String passwordEncode(String password) {
        return passwordEncoder.encode(password);
    }

    public boolean validatePassword(String password, String encryptedPassword) {
        return passwordEncoder.matches(password, encryptedPassword);
    }
}
