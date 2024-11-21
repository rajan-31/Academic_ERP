package org.myprojects.academic_erp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "specialization")
public class Specialization {
    @Id
    @Column(name = "specialization_id")
    private Integer specializationId;

    @Column(name = "code", unique = true, nullable = false, length = 20)
    private String code;

    @Column(name = "name", length = 50)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "year")
    private Integer year;

    @Column(name = "credits_required")
    private Integer creditsRequired;
}
