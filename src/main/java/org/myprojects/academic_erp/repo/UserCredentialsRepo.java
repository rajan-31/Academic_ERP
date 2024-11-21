package org.myprojects.academic_erp.repo;

import jakarta.transaction.Transactional;
import org.myprojects.academic_erp.entity.UserCredentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCredentialsRepo extends JpaRepository<UserCredentials, Long> {
    Optional<UserCredentials> findByEmail(String email);

    @Transactional
    void deleteByEmail(String email);
}
