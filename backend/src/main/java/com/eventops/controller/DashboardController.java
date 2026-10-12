package com.eventops.controller;

import com.eventops.dto.ApiResponse;
import com.eventops.dto.DashboardStatsDto;
import com.eventops.entity.Role;
import com.eventops.security.UserPrincipal;
import com.eventops.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getAdminDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminStats()));
    }

    @GetMapping("/coordinator")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getCoordinatorDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getCoordinatorStats(currentUser.getId())));
    }

    @GetMapping("/team-lead")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'TEAM_LEAD')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getTeamLeadDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getTeamLeadStats(currentUser.getId())));
    }

    @GetMapping("/volunteer")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getVolunteerDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getVolunteerStats(currentUser.getId())));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardSummary(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminStats()));
        } else if (currentUser.getRole() == Role.COORDINATOR) {
            return ResponseEntity.ok(ApiResponse.success(dashboardService.getCoordinatorStats(currentUser.getId())));
        } else if (currentUser.getRole() == Role.TEAM_LEAD) {
            return ResponseEntity.ok(ApiResponse.success(dashboardService.getTeamLeadStats(currentUser.getId())));
        } else {
            return ResponseEntity.ok(ApiResponse.success(dashboardService.getVolunteerStats(currentUser.getId())));
        }
    }
}
