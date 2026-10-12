package com.eventops.repository;

import com.eventops.entity.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByEventId(Long eventId);
    List<Resource> findByCategory(String category);

    @Query("SELECT r FROM Resource r WHERE " +
           "(:category IS NULL OR r.category = :category) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:query IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Resource> searchResources(@Param("category") String category,
                                   @Param("status") String status,
                                   @Param("query") String query,
                                   Pageable pageable);

    @Query("SELECT COALESCE(SUM(r.totalQuantity), 0) FROM Resource r")
    long sumTotalQuantity();

    @Query("SELECT COALESCE(SUM(r.availableQuantity), 0) FROM Resource r")
    long sumAvailableQuantity();
}
