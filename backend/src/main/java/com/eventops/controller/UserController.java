package com.eventops.controller;

import com.eventops.dto.ApiResponse;
import com.eventops.dto.UserDto;
import com.eventops.entity.Role;
import com.eventops.security.UserPrincipal;
import com.eventops.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String query) {
        List<UserDto> users;
        if (query != null && !query.isBlank()) {
            users = userService.searchUsers(query);
        } else if (role != null) {
            users = userService.getUsersByRole(role);
        } else {
            users = userService.getAllUsers();
        }
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/volunteers")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'TEAM_LEAD')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getVolunteers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersByRole(Role.VOLUNTEER)));
    }

    @GetMapping("/team-leads")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getTeamLeads() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersByRole(Role.TEAM_LEAD)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Role newRole = Role.valueOf(body.get("role"));
        UserDto updated = userService.updateUserRole(id, newRole, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Role updated successfully", updated));
    }

    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> toggleStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UserDto updated = userService.toggleUserStatus(id, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("User status changed", updated));
    }
}
