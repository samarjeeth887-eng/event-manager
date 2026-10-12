package com.eventops.repository;

import com.eventops.entity.Event;
import com.eventops.entity.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(EventStatus status);
    long countByStatus(EventStatus status);

    @Query("SELECT e FROM Event e WHERE " +
           "(:query IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:status IS NULL OR e.status = :status)")
    Page<Event> searchEvents(@Param("query") String query,
                             @Param("category") String category,
                             @Param("status") EventStatus status,
                             Pageable pageable);

    List<Event> findByOrganizerContainingIgnoreCase(String organizer);
}
