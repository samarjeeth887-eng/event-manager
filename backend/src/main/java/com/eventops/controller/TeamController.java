package com.eventops.controller;

import com.eventops.dto.ApiResponse;
import com.eventops.dto.TeamDto;
import com.eventops.dto.TeamMemberDto;
import com.eventops.dto.TeamMemberRequest;
import com.eventops.dto.TeamRequest;
import com.eventops.security.UserPrincipal;
import com.eventops.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamDto>>> getAllTeams() {
        return ResponseEntity.ok(ApiResponse.success(teamService.getAllTeams()));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<TeamDto>>> getTeamsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getTeamsByEventId(eventId)));
    }

    @GetMapping("/my-led-teams")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'TEAM_LEAD')")
    public ResponseEntity<ApiResponse<List<TeamDto>>> getMyLedTeams(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getTeamsByLeadId(currentUser.getId())));
    }

    @GetMapping("/my-teams")
    public ResponseEntity<ApiResponse<List<TeamDto>>> getMyTeams(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getTeamsForUser(currentUser.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeamDto>> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getTeamById(id)));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<ApiResponse<List<TeamMemberDto>>> getTeamMembers(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getTeamMembers(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<TeamDto>> createTeam(
            @Valid @RequestBody TeamRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        TeamDto created = teamService.createTeam(request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Team created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<TeamDto>> updateTeam(
            @PathVariable Long id,
            @Valid @RequestBody TeamRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        TeamDto updated = teamService.updateTeam(id, request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Team updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        teamService.deleteTeam(id, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Team deleted successfully", null));
    }

    @PostMapping("/members")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'TEAM_LEAD')")
    public ResponseEntity<ApiResponse<TeamMemberDto>> addMember(
            @Valid @RequestBody TeamMemberRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        TeamMemberDto member = teamService.addMember(request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Member added to team successfully", member));
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'TEAM_LEAD')")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable Long teamId,
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        teamService.removeMember(teamId, userId, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Member removed from team successfully", null));
    }
}
