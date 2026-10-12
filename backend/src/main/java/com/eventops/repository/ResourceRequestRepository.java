package com.eventops.repository;

import com.eventops.entity.ApprovalStatus;
import com.eventops.entity.ResourceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRequestRepository extends JpaRepository<ResourceRequest, Long> {
    List<ResourceRequest> findByEventId(Long eventId);
    List<ResourceRequest> findByRequestedById(Long requestedById);
    List<ResourceRequest> findByStatus(ApprovalStatus status);
    long countByStatus(ApprovalStatus status);

    @Query("SELECT req FROM ResourceRequest req WHERE " +
           "(:eventId IS NULL OR req.event.id = :eventId) AND " +
           "(:status IS NULL OR req.status = :status) AND " +
           "(:requestedById IS NULL OR req.requestedBy.id = :requestedById)")
    Page<ResourceRequest> searchRequests(@Param("eventId") Long eventId,
                                         @Param("status") ApprovalStatus status,
                                         @Param("requestedById") Long requestedById,
                                         Pageable pageable);
}
