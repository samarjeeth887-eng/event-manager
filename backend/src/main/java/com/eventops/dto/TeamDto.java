package com.eventops.dto;

import com.eventops.entity.Team;
import java.time.LocalDateTime;

public class TeamDto {
    private Long id;
    private String name;
    private String description;
    private Long eventId;
    private String eventName;
    private Long teamLeadId;
    private String teamLeadName;
    private String status;
    private LocalDateTime createdAt;
    private int memberCount;

    public TeamDto() {
    }

    public static TeamDto fromEntity(Team team) {
        if (team == null) return null;
        TeamDto dto = new TeamDto();
        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setDescription(team.getDescription());
        if (team.getEvent() != null) {
            dto.setEventId(team.getEvent().getId());
            dto.setEventName(team.getEvent().getName());
        }
        if (team.getTeamLead() != null) {
            dto.setTeamLeadId(team.getTeamLead().getId());
            dto.setTeamLeadName(team.getTeamLead().getName());
        }
        dto.setStatus(team.getStatus());
        dto.setCreatedAt(team.getCreatedAt());
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

    public Long getTeamLeadId() {
        return teamLeadId;
    }

    public void setTeamLeadId(Long teamLeadId) {
        this.teamLeadId = teamLeadId;
    }

    public String getTeamLeadName() {
        return teamLeadName;
    }

    public void setTeamLeadName(String teamLeadName) {
        this.teamLeadName = teamLeadName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }
}
