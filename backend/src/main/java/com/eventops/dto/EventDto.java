package com.eventops.dto;

import com.eventops.entity.Event;
import com.eventops.entity.EventStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EventDto {
    private Long id;
    private String name;
    private String description;
    private String category;
    private LocalDate startDate;
    private LocalDate endDate;
    private String venue;
    private String organizer;
    private EventStatus status;
    private Integer maxParticipants;
    private Double budget;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long teamCount;
    private long taskCount;

    public EventDto() {
    }

    public static EventDto fromEntity(Event event) {
        if (event == null) return null;
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDescription(event.getDescription());
        dto.setCategory(event.getCategory());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setVenue(event.getVenue());
        dto.setOrganizer(event.getOrganizer());
        dto.setStatus(event.getStatus());
        dto.setMaxParticipants(event.getMaxParticipants());
        dto.setBudget(event.getBudget());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public long getTeamCount() {
        return teamCount;
    }

    public void setTeamCount(long teamCount) {
        this.teamCount = teamCount;
    }

    public long getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(long taskCount) {
        this.taskCount = taskCount;
    }
}
