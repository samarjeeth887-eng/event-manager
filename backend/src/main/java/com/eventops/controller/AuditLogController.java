package com.eventops.controller;

import com.eventops.dto.ApiResponse;
import com.eventops.dto.AuditLogDto;
import com.eventops.service.AuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogDto>>> getRecentLogs() {
        return ResponseEntity.ok(ApiResponse.success(auditLogService.getRecentLogs()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<AuditLogDto>>> searchAuditLogs(
            @RequestParam(required = false) String entityName,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<AuditLogDto> result = auditLogService.searchLogs(entityName, query, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
