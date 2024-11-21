package org.myprojects.academic_erp.repo;

import org.myprojects.academic_erp.entity.Placement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlacementRepo extends JpaRepository<Placement, Long> {
}
