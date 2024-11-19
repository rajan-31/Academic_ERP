package org.myprojects.academic_erp.repo;

import org.myprojects.academic_erp.entity.Domain;
import org.myprojects.academic_erp.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepo extends JpaRepository<Student, Long> {
    Long countByDomain(Domain domain);

    // Count students with same domain code
//    @Query("SELECT COUNT(s) FROM Student s WHERE s.domain.code = :code")
//    Long countByDomainCode(@Param("code") String code);
//    Long countByDomain_Code(String code);

    @Query("SELECT email FROM Student WHERE email LIKE :prefix%")
    List<String> findEmailsWithPrefix(@Param("prefix") String prefix);
}
