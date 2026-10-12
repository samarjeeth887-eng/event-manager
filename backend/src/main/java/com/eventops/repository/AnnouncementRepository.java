package com.eventops.repository;

import com.eventops.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByTargetRoleInOrderByCreatedAtDesc(List<String> targetRoles);
    List<Announcement> findByEventIdOrderByCreatedAtDesc(Long eventId);
    List<Announcement> findAllByOrderByCreatedAtDesc();
}
