package org.myprojects.academic_erp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LoginResponse(
        @JsonProperty("jwtToken")
        String jwtToken,

        @JsonProperty("user_type")
        String userType
) {
}