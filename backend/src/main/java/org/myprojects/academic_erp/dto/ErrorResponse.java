package org.myprojects.academic_erp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;


public record ErrorResponse(
        @JsonProperty("status")
        int status,

        @JsonProperty("message")
        String message
) {
}
