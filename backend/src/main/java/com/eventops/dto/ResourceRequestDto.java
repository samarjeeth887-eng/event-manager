package com.eventops.dto;

import com.eventops.entity.ApprovalStatus;
import com.eventops.entity.ResourceRequest;
import java.time.LocalDateTime;

public class ResourceRequestDto {
    private Long id;
    private Long eventId;
    private String eventName;
    private Long resourceId;
    private String resourceName;
    private String resourceCategory;
    private Long requestedById;
    private String requestedByName;
    private String requestedByEmail;
    private Integer quantity;
    private String purpose;
    private ApprovalStatus status;
    private String approverComments;
    private Long reviewedById;
    private String reviewedByName;
    private LocalDateTime requestedAt;
    private LocalDateTime reviewedAt;

    public ResourceRequestDto() {
    }

    public static ResourceRequestDto fromEntity(ResourceRequest req) {
        if (req == null) return null;
        ResourceRequestDto dto = new ResourceRequestDto();
        dto.setId(req.getId());
        if (req.getEvent() != null) {
            dto.setEventId(req.getEvent().getId());
            dto.setEventName(req.getEvent().getName());
        }
        if (req.getResource() != null) {
            dto.setResourceId(req.getResource().getId());
            dto.setResourceName(req.getResource().getName());
            dto.setResourceCategory(req.getResource().getCategory());
        }
        if (req.getRequestedBy() != null) {
            dto.setRequestedById(req.getRequestedBy().getId());
            dto.setRequestedByName(req.getRequestedBy().getName());
            dto.setRequestedByEmail(req.getRequestedBy().getEmail());
        }
        dto.setQuantity(req.getQuantity());
        dto.setPurpose(req.getPurpose());
        dto.setStatus(req.getStatus());
        dto.setApproverComments(req.getApproverComments());
        if (req.getReviewedBy() != null) {
            dto.setReviewedById(req.getReviewedBy().getId());
            dto.setReviewedByName(req.getReviewedBy().getName());
        }
        dto.setRequestedAt(req.getRequestedAt());
        dto.setReviewedAt(req.getReviewedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getResourceCategory() {
        return resourceCategory;
    }

    public void setResourceCategory(String resourceCategory) {
        this.resourceCategory = resourceCategory;
    }

    public Long getRequestedById() {
        return requestedById;
    }

    public void setRequestedById(Long requestedById) {
        this.requestedById = requestedById;
    }

    public String getRequestedByName() {
        return requestedByName;
    }

    public void setRequestedByName(String requestedByName) {
        this.requestedByName = requestedByName;
    }

    public String getRequestedByEmail() {
        return requestedByEmail;
    }

    public void setRequestedByEmail(String requestedByEmail) {
        this.requestedByEmail = requestedByEmail;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public ApprovalStatus getStatus() {
        return status;
    }

    public void setStatus(ApprovalStatus status) {
        this.status = status;
    }

    public String getApproverComments() {
        return approverComments;
    }

    public void setApproverComments(String approverComments) {
        this.approverComments = approverComments;
    }

    public Long getReviewedById() {
        return reviewedById;
    }

    public void setReviewedById(Long reviewedById) {
        this.reviewedById = reviewedById;
    }

    public String getReviewedByName() {
        return reviewedByName;
    }

    public void setReviewedByName(String reviewedByName) {
        this.reviewedByName = reviewedByName;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}
