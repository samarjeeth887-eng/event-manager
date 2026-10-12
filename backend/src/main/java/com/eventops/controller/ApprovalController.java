package com.eventops.controller;

import com.eventops.dto.ApiResponse;
import com.eventops.dto.ApprovalActionRequest;
import com.eventops.dto.ResourceRequestDto;
import com.eventops.entity.ApprovalStatus;
import com.eventops.security.UserPrincipal;
import com.eventops.service.ApprovalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    private final ApprovalService approvalService;

    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ResourceRequestDto>>> getPendingApprovals() {
        return ResponseEntity.ok(ApiResponse.success(approvalService.getRequestsByStatus(ApprovalStatus.PENDING)));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceRequestDto>> approve(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalActionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String comment = request != null ? request.getComment() : null;
        ResourceRequestDto approved = approvalService.approveRequest(id, comment, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Approved successfully", approved));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceRequestDto>> reject(
            @PathVariable Long id,
            @RequestBody(required = false) ApprovalActionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        String comment = request != null ? request.getComment() : null;
        ResourceRequestDto rejected = approvalService.rejectRequest(id, comment, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Rejected successfully", rejected));
    }
}
