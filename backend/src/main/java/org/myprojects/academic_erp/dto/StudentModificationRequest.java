package org.myprojects.academic_erp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record StudentModificationRequest(
        @JsonProperty("roll_number_modify")
        Boolean rollNumberModify,

        @JsonProperty("first_name")
        String firstName,

        @JsonProperty("last_name")
        String lastName,

        @JsonProperty("email_modify")
        Boolean emailModify,

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

        @JsonProperty("placement")
        Long placement
) {
}
