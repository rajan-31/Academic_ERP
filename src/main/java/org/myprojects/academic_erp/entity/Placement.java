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
@Table(name = "placement")
public class Placement {
    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "organisation", length = 100)
    private String organisation;

    @Column(name = "profile", length = 100)
    private String profile;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "intake")
    private Integer intake;

    @Column(name = "minimum_grade")
    private Float minimumGrade;
}
