package org.myprojects.academic_erp.repo;

import org.myprojects.academic_erp.entity.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DomainRepo extends JpaRepository<Domain, Integer> {
    List<Domain> getDomainByCode(String code);
}
