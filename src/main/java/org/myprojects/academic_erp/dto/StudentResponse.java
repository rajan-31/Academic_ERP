package org.myprojects.academic_erp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record StudentResponse(
        @JsonProperty("student_id")
        Long studentId,

        @JsonProperty("roll_number")
        String rollNumber,

        @JsonProperty("first_name")
        String firstName,

        @JsonProperty("last_name")
        String lastName,

        @JsonProperty("email")
        String email,

        @JsonProperty("photograph_path")
        String photographPath,

        @JsonProperty("cgpa")
        Float cgpa,

        @JsonProperty("total_credits")
        Integer totalCredits,

        @JsonProperty("graduation_year")
        Integer graduationYear,

        @JsonProperty("domain")
        Integer domain,

        @JsonProperty("specialization")
        Integer specialization,

        @JsonProperty
        Long placement
) {
}
