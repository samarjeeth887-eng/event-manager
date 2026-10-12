package com.eventops.dto;

import com.eventops.entity.Resource;
import java.time.LocalDateTime;

public class ResourceDto {
    private Long id;
    private String name;
    private String category;
    private Integer totalQuantity;
    private Integer availableQuantity;
    private Long eventId;
    private String eventName;
    private String status;
    private Double unitCost;
    private LocalDateTime createdAt;

    public ResourceDto() {
    }

    public static ResourceDto fromEntity(Resource resource) {
        if (resource == null) return null;
        ResourceDto dto = new ResourceDto();
        dto.setId(resource.getId());
        dto.setName(resource.getName());
        dto.setCategory(resource.getCategory());
        dto.setTotalQuantity(resource.getTotalQuantity());
        dto.setAvailableQuantity(resource.getAvailableQuantity());
        if (resource.getEvent() != null) {
            dto.setEventId(resource.getEvent().getId());
            dto.setEventName(resource.getEvent().getName());
        }
        dto.setStatus(resource.getStatus());
        dto.setUnitCost(resource.getUnitCost());
        dto.setCreatedAt(resource.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Integer totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(Double unitCost) {
        this.unitCost = unitCost;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
