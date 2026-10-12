package com.eventops.service;

import com.eventops.dto.AnnouncementDto;
import com.eventops.dto.AnnouncementRequest;
import com.eventops.entity.Announcement;
import com.eventops.entity.Event;
import com.eventops.entity.User;
import com.eventops.exception.ResourceNotFoundException;
import com.eventops.repository.AnnouncementRepository;
import com.eventops.repository.EventRepository;
import com.eventops.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               EventRepository eventRepository,
                               UserRepository userRepository,
                               AuditLogService auditLogService) {
        this.announcementRepository = announcementRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<AnnouncementDto> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(AnnouncementDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AnnouncementDto> getAnnouncementsForRole(String roleName) {
        List<String> targetRoles = Arrays.asList("ALL", roleName);
        return announcementRepository.findByTargetRoleInOrderByCreatedAtDesc(targetRoles).stream()
                .map(AnnouncementDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public AnnouncementDto createAnnouncement(AnnouncementRequest request, String userEmail, Long userId) {
        Event event = null;
        if (request.getEventId() != null) {
            event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));
        }

        User user = userRepository.findById(userId).orElse(null);

        Announcement announcement = new Announcement(
                request.getTitle().trim(),
                request.getMessage().trim(),
                request.getTargetRole() != null ? request.getTargetRole() : "ALL",
                event,
                user
        );

        Announcement saved = announcementRepository.save(announcement);
        auditLogService.log(userId, userEmail, "ANNOUNCEMENT_CREATE", "Announcement", saved.getId(),
                "Posted announcement: " + saved.getTitle());

        return AnnouncementDto.fromEntity(saved);
    }
}
