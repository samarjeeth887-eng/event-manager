package com.eventops.controller;

import com.eventops.dto.ApiResponse;
import com.eventops.dto.ApprovalActionRequest;
import com.eventops.dto.CreateResourceRequestDto;
import com.eventops.dto.ResourceRequestDto;
import com.eventops.entity.ApprovalStatus;
import com.eventops.security.UserPrincipal;
import com.eventops.service.ApprovalService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resource-requests")
public class ResourceRequestController {

    private final ApprovalService approvalService;

    public ResourceRequestController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResourceRequestDto>>> getAllRequests(
            @RequestParam(required = false) ApprovalStatus status,
            @RequestParam(required = false) Long eventId) {
        if (eventId != null) {
            return ResponseEntity.ok(ApiResponse.success(approvalService.getRequestsByEvent(eventId)));
        }
        if (status != null) {
            return ResponseEntity.ok(ApiResponse.success(approvalService.getRequestsByStatus(status)));
        }
        return ResponseEntity.ok(ApiResponse.success(approvalService.getAllRequests()));
    }

    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<ResourceRequestDto>>> getMyRequests(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success(approvalService.getRequestsByUser(currentUser.getId())));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ResourceRequestDto>>> searchRequests(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) ApprovalStatus status,
            @RequestParam(required = false) Long requestedById,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ResourceRequestDto> result = approvalService.searchRequests(eventId, status, requestedById, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<ResourceRequestDto>> createRequest(
            @Valid @RequestBody CreateResourceRequestDto dto,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ResourceRequestDto created = approvalService.createRequest(dto, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resource request submitted successfully", created));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceRequestDto>> approveRequest(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalActionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String comment = request != null ? request.getComment() : null;
        ResourceRequestDto approved = approvalService.approveRequest(id, comment, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Resource request approved successfully", approved));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceRequestDto>> rejectRequest(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalActionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String comment = request != null ? request.getComment() : null;
        ResourceRequestDto rejected = approvalService.rejectRequest(id, comment, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Resource request rejected", rejected));
    }
}
