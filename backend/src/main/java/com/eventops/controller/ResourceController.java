package com.eventops.controller;

import com.eventops.dto.ApiResponse;
import com.eventops.dto.ResourceCreateRequest;
import com.eventops.dto.ResourceDto;
import com.eventops.security.UserPrincipal;
import com.eventops.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResourceDto>>> getAllResources() {
        return ResponseEntity.ok(ApiResponse.success(resourceService.getAllResources()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ResourceDto>>> searchResources(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ResourceDto> result = resourceService.searchResources(category, status, query, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceDto>> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(resourceService.getResourceById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<ResourceDto>> createResource(
            @Valid @RequestBody ResourceCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ResourceDto created = resourceService.createResource(request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resource created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<ResourceDto>> updateResource(
            @PathVariable Long id,
            @Valid @RequestBody ResourceCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ResourceDto updated = resourceService.updateResource(id, request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Resource updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteResource(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        resourceService.deleteResource(id, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Resource deleted successfully", null));
    }
}
