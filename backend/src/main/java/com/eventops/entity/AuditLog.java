package com.eventops.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String action; // e.g. "USER_LOGIN", "CREATE_EVENT", "UPDATE_TASK_STATUS", "APPROVE_RESOURCE_REQUEST"

    @Column(nullable = false)
    private String entityName; // Event, Task, Resource, Request, Vendor, Team, User

    private Long entityId;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public AuditLog() {
    }

    public AuditLog(Long userId, String userEmail, String action, String entityName, Long entityId, String details) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.action = action;
        this.entityName = entityName;
        this.entityId = entityId;
        this.details = details;
        this.timestamp = LocalDateTime.now();
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
