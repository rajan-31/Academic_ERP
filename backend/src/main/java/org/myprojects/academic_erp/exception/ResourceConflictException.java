package org.myprojects.academic_erp.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ResourceConflictException extends RuntimeException {
  private final String message;
}
