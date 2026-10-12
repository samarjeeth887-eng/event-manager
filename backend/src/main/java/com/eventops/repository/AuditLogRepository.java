package com.eventops.repository;

import com.eventops.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findTop10ByOrderByTimestampDesc();

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:entityName IS NULL OR a.entityName = :entityName) AND " +
           "(:query IS NULL OR LOWER(a.userEmail) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.action) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.details) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<AuditLog> searchAuditLogs(@Param("entityName") String entityName,
                                   @Param("query") String query,
                                   Pageable pageable);
}
