package org.myprojects.academic_erp.repo;

import org.myprojects.academic_erp.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecializationRepo extends JpaRepository<Specialization, Integer> {
}
