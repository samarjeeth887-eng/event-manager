package com.eventops.repository;

import com.eventops.entity.PaymentStatus;
import com.eventops.entity.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    List<Vendor> findByEventId(Long eventId);

    @Query("SELECT v FROM Vendor v WHERE " +
           "(:category IS NULL OR v.category = :category) AND " +
           "(:paymentStatus IS NULL OR v.paymentStatus = :paymentStatus) AND " +
           "(:query IS NULL OR LOWER(v.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(v.contactPerson) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Vendor> searchVendors(@Param("category") String category,
                               @Param("paymentStatus") PaymentStatus paymentStatus,
                               @Param("query") String query,
                               Pageable pageable);

    @Query("SELECT COALESCE(SUM(v.contractAmount), 0) FROM Vendor v")
    double sumTotalContracts();
}
