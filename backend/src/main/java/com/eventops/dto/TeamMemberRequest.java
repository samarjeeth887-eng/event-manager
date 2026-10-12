package com.eventops.dto;

import jakarta.validation.constraints.NotNull;

public class TeamMemberRequest {

    @NotNull(message = "Team ID is required")
    private Long teamId;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String roleInTeam = "MEMBER";

    public TeamMemberRequest() {
    }

    public TeamMemberRequest(Long teamId, Long userId, String roleInTeam) {
        this.teamId = teamId;
        this.userId = userId;
        this.roleInTeam = roleInTeam;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRoleInTeam() {
        return roleInTeam;
    }

    public void setRoleInTeam(String roleInTeam) {
        this.roleInTeam = roleInTeam;
    }
}
