package com.eventops.service;

import com.eventops.dto.AuditLogDto;
import com.eventops.entity.AuditLog;
import com.eventops.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void log(Long userId, String userEmail, String action, String entityName, Long entityId, String details) {
        AuditLog auditLog = new AuditLog(userId, userEmail, action, entityName, entityId, details);
        auditLogRepository.save(auditLog);
    }

    @Transactional(readOnly = true)
    public List<AuditLogDto> getRecentLogs() {
        return auditLogRepository.findTop10ByOrderByTimestampDesc()
                .stream()
                .map(AuditLogDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<AuditLogDto> searchLogs(String entityName, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        return auditLogRepository.searchAuditLogs(entityName, query, pageable)
                .map(AuditLogDto::fromEntity);
    }
}
