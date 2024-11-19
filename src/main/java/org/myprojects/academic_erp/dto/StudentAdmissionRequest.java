package org.myprojects.academic_erp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record StudentAdmissionRequest(
        @NotNull(message = "First name is required")
        @NotBlank(message = "First name can't be empty")
        @JsonProperty("first_name")
        String firstName,

        @NotNull(message = "Last name is required")
        @NotBlank(message = "Last name can't be empty")
        @JsonProperty("last_name")
        String lastName,

        @NotNull(message = "Domain is required")
        @Positive(message = "Invalid domain")
        @JsonProperty("domain")
        Integer domain
) {
}
