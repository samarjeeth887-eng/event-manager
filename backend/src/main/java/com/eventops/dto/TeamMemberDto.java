package com.eventops.dto;

import com.eventops.entity.TeamMember;
import java.time.LocalDateTime;

public class TeamMemberDto {
    private Long id;
    private Long teamId;
    private String teamName;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userRole;
    private String roleInTeam;
    private LocalDateTime joinedAt;

    public TeamMemberDto() {
    }

    public static TeamMemberDto fromEntity(TeamMember member) {
        if (member == null) return null;
        TeamMemberDto dto = new TeamMemberDto();
        dto.setId(member.getId());
        if (member.getTeam() != null) {
            dto.setTeamId(member.getTeam().getId());
            dto.setTeamName(member.getTeam().getName());
        }
        if (member.getUser() != null) {
            dto.setUserId(member.getUser().getId());
            dto.setUserName(member.getUser().getName());
            dto.setUserEmail(member.getUser().getEmail());
            dto.setUserRole(member.getUser().getRole().name());
        }
        dto.setRoleInTeam(member.getRoleInTeam());
        dto.setJoinedAt(member.getJoinedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getRoleInTeam() {
        return roleInTeam;
    }

    public void setRoleInTeam(String roleInTeam) {
        this.roleInTeam = roleInTeam;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
