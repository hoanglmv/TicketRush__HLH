package com.ticketrush.repository;

import com.ticketrush.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findByEventIdOrderBySortOrder(Long eventId);
}
