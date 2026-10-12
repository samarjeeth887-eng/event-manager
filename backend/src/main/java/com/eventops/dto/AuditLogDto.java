package com.eventops.dto;

import com.eventops.entity.AuditLog;
import java.time.LocalDateTime;

public class AuditLogDto {
    private Long id;
    private Long userId;
    private String userEmail;
    private String action;
    private String entityName;
    private Long entityId;
    private String details;
    private LocalDateTime timestamp;

    public AuditLogDto() {
    }

    public static AuditLogDto fromEntity(AuditLog log) {
        if (log == null) return null;
        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());
        dto.setUserId(log.getUserId());
        dto.setUserEmail(log.getUserEmail());
        dto.setAction(log.getAction());
        dto.setEntityName(log.getEntityName());
        dto.setEntityId(log.getEntityId());
        dto.setDetails(log.getDetails());
        dto.setTimestamp(log.getTimestamp());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
