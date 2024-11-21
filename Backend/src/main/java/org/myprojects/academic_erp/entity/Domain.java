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
@Table(name = "domain")
public class Domain {
    @Id
    @Column(name = "domain_id")
    private Integer domainId;

    @Column(name = "program", length = 50)
    private String program;

    @Column(name = "code", nullable = false, length = 20)
    private String code;

    @Column(name = "batch")
    private Integer batch;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "qualification", length = 50)
    private String qualification;
}
