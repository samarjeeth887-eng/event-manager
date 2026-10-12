package com.eventops.controller;

import com.eventops.dto.AnnouncementDto;
import com.eventops.dto.AnnouncementRequest;
import com.eventops.dto.ApiResponse;
import com.eventops.security.UserPrincipal;
import com.eventops.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AnnouncementDto>>> getAnnouncements(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser != null) {
            return ResponseEntity.ok(ApiResponse.success(
                    announcementService.getAnnouncementsForRole(currentUser.getRole().name())
            ));
        }
        return ResponseEntity.ok(ApiResponse.success(announcementService.getAllAnnouncements()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<AnnouncementDto>> createAnnouncement(
            @Valid @RequestBody AnnouncementRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        AnnouncementDto created = announcementService.createAnnouncement(
                request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Announcement posted successfully", created));
    }
}
