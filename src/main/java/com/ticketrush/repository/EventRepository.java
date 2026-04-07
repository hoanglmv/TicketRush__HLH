package com.ticketrush.repository;

import com.ticketrush.entity.Event;
import com.ticketrush.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(EventStatus status);

    List<Event> findByStatusIn(List<EventStatus> statuses);

    @Query("SELECT e FROM Event e WHERE (e.status IN :statuses) AND " +
           "(LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.venue) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Event> searchByKeyword(@Param("keyword") String keyword, @Param("statuses") List<EventStatus> statuses);

    @Query("SELECT e FROM Event e WHERE e.status = 'ON_SALE' AND e.queueEnabled = true")
    List<Event> findOnSaleWithQueueEnabled();
}
