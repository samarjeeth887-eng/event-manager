package com.eventops.controller;

import com.eventops.dto.ApiResponse;
import com.eventops.dto.TaskDto;
import com.eventops.dto.TaskRequest;
import com.eventops.dto.TaskStatusUpdateRequest;
import com.eventops.entity.TaskPriority;
import com.eventops.entity.TaskStatus;
import com.eventops.security.UserPrincipal;
import com.eventops.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskDto>>> getAllTasks() {
        return ResponseEntity.ok(ApiResponse.success(taskService.getAllTasks()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<TaskDto>>> searchTasks(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) Long assignedUserId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<TaskDto> result = taskService.searchTasks(eventId, teamId, assignedUserId, status, priority, query, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getMyTasks(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTasksByAssignedUserId(currentUser.getId())));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTasksByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTasksByEventId(eventId)));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTasksByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTasksByTeamId(teamId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDto>> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTaskById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'TEAM_LEAD')")
    public ResponseEntity<ApiResponse<TaskDto>> createTask(
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        TaskDto created = taskService.createTask(request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'TEAM_LEAD')")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        TaskDto updated = taskService.updateTask(id, request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskDto>> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody TaskStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        TaskDto updated = taskService.updateTaskStatus(
                id,
                request.getStatus(),
                request.getComment(),
                currentUser.getUsername(),
                currentUser.getId(),
                currentUser.getRole()
        );
        return ResponseEntity.ok(ApiResponse.success("Task status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        taskService.deleteTask(id, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }
}
