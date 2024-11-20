package org.myprojects.academic_erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "roll_number", unique = true, nullable = false, length = 20)
    private String rollNumber;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "photograph_path")
    private String photographPath;

    @Column(name = "cgpa")
    private Float cgpa;

    @Column(name = "total_credits")
    private Integer totalCredits;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "domain", referencedColumnName = "domain_id", foreignKey = @ForeignKey(name = "FK_Student_Domain"))
    private Domain domain;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialization", referencedColumnName = "specialization_id", foreignKey = @ForeignKey(name = "FK_Student_Specialization"))
    private Specialization specialization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "placement", referencedColumnName = "id", foreignKey = @ForeignKey(name = "FK_Student_Placement"))
    private Placement placement;
}
