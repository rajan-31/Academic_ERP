package org.myprojects.academic_erp.exception;

import lombok.RequiredArgsConstructor;
import org.myprojects.academic_erp.dto.ErrorResponse;
import org.myprojects.academic_erp.mapper.UserCredentialsMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    private final UserCredentialsMapper userCredentialsMapper;

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(userCredentialsMapper.toErrorResponse(
                        HttpStatus.UNAUTHORIZED.value(), ex.getMessage()
                ));
    }
}
