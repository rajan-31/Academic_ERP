package org.myprojects.academic_erp.helper;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class EncryptionService {
    private final PasswordEncoder passwordEncoder;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    private static final int PASSWORD_LENGTH = 6;

    public String passwordEncode(String password) {
        return passwordEncoder.encode(password);
    }

    public boolean validatePassword(String password, String encryptedPassword) {
        return passwordEncoder.matches(password, encryptedPassword);
    }

    public String generateSecurePassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(randomIndex));
        }

//        return password.toString();
        return "123456";
    }
}
