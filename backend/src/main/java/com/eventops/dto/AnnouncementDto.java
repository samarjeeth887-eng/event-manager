package com.eventops.dto;

import com.eventops.entity.Announcement;
import java.time.LocalDateTime;

public class AnnouncementDto {
    private Long id;
    private String title;
    private String message;
    private String targetRole;
    private Long eventId;
    private String eventName;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;

    public AnnouncementDto() {
    }

    public static AnnouncementDto fromEntity(Announcement a) {
        if (a == null) return null;
        AnnouncementDto dto = new AnnouncementDto();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setMessage(a.getMessage());
        dto.setTargetRole(a.getTargetRole());
        if (a.getEvent() != null) {
            dto.setEventId(a.getEvent().getId());
            dto.setEventName(a.getEvent().getName());
        }
        if (a.getCreatedBy() != null) {
            dto.setCreatedById(a.getCreatedBy().getId());
            dto.setCreatedByName(a.getCreatedBy().getName());
        }
        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
