package org.myprojects.academic_erp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.myprojects.academic_erp.dto.LoginRequest;
import org.myprojects.academic_erp.dto.LoginResponse;
import org.myprojects.academic_erp.service.AuthorizationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/auth")
public class AuthorizationController {
    private final AuthorizationService authorizationService;

    @PostMapping(path = "/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(authorizationService.loginUser(request));
    }

    @PostMapping(path = "/signup")
    public ResponseEntity<String> createUserCredentials(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authorizationService.createUserCredentials(request));
    }


}
