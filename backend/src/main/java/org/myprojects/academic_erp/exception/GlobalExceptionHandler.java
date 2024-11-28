package org.myprojects.academic_erp.exception;

import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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

    private static final Logger LOGGER = LogManager.getLogger();

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        LOGGER.error(ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(userCredentialsMapper.toErrorResponse(
                        HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage()   // 500
                ));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(userCredentialsMapper.toErrorResponse(
                        HttpStatus.UNAUTHORIZED.value(), ex.getMessage()    // 401
                ));
    }

    @ExceptionHandler(StudentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleStudentNotFoundException(StudentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(userCredentialsMapper.toErrorResponse(
                        HttpStatus.NOT_FOUND.value(), ex.getMessage()   // 404
                ));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(userCredentialsMapper.toErrorResponse(
                        HttpStatus.FORBIDDEN.value(), ex.getMessage()   // 403
                ));
    }

    @ExceptionHandler(StudentDataInvalidException.class)
    public ResponseEntity<ErrorResponse> handleStudentDataInvalidException(StudentDataInvalidException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(userCredentialsMapper.toErrorResponse(
                        HttpStatus.BAD_REQUEST.value(), ex.getMessage()     // 400
                ));
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<ErrorResponse> handleResourceConflictException(ResourceConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(userCredentialsMapper.toErrorResponse(
                        HttpStatus.CONFLICT.value(), ex.getMessage()    // 409
                ));
    }
}
