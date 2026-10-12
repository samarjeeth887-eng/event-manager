package com.eventops.service;

import com.eventops.dto.ResourceCreateRequest;
import com.eventops.dto.ResourceDto;
import com.eventops.entity.Event;
import com.eventops.entity.Resource;
import com.eventops.exception.BadRequestException;
import com.eventops.exception.ResourceNotFoundException;
import com.eventops.repository.EventRepository;
import com.eventops.repository.ResourceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final EventRepository eventRepository;
    private final AuditLogService auditLogService;

    public ResourceService(ResourceRepository resourceRepository,
                           EventRepository eventRepository,
                           AuditLogService auditLogService) {
        this.resourceRepository = resourceRepository;
        this.eventRepository = eventRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<ResourceDto> getAllResources() {
        return resourceRepository.findAll(Sort.by("name").ascending()).stream()
                .map(ResourceDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResourceDto getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
        return ResourceDto.fromEntity(resource);
    }

    @Transactional(readOnly = true)
    public Page<ResourceDto> searchResources(String category, String status, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return resourceRepository.searchResources(
                (category != null && !category.isBlank()) ? category.trim() : null,
                (status != null && !status.isBlank()) ? status.trim() : null,
                (query != null && !query.isBlank()) ? query.trim() : null,
                pageable
        ).map(ResourceDto::fromEntity);
    }

    @Transactional
    public ResourceDto createResource(ResourceCreateRequest request, String userEmail, Long userId) {
        Event event = null;
        if (request.getEventId() != null) {
            event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));
        }

        Resource resource = new Resource(
                request.getName().trim(),
                request.getCategory().trim(),
                request.getTotalQuantity(),
                request.getTotalQuantity(),
                event,
                "AVAILABLE",
                request.getUnitCost()
        );

        Resource saved = resourceRepository.save(resource);
        auditLogService.log(userId, userEmail, "RESOURCE_CREATE", "Resource", saved.getId(),
                "Added resource: " + saved.getName() + " (Total: " + saved.getTotalQuantity() + ")");

        return ResourceDto.fromEntity(saved);
    }

    @Transactional
    public ResourceDto updateResource(Long id, ResourceCreateRequest request, String userEmail, Long userId) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        resource.setName(request.getName().trim());
        resource.setCategory(request.getCategory().trim());

        int delta = request.getTotalQuantity() - resource.getTotalQuantity();
        resource.setTotalQuantity(request.getTotalQuantity());
        resource.setAvailableQuantity(Math.max(0, resource.getAvailableQuantity() + delta));
        resource.setUnitCost(request.getUnitCost());

        if (resource.getAvailableQuantity() == 0) {
            resource.setStatus("OUT_OF_STOCK");
        } else if (resource.getAvailableQuantity() < resource.getTotalQuantity()) {
            resource.setStatus("PARTIALLY_ALLOCATED");
        } else {
            resource.setStatus("AVAILABLE");
        }

        Resource saved = resourceRepository.save(resource);
        auditLogService.log(userId, userEmail, "RESOURCE_UPDATE", "Resource", saved.getId(),
                "Updated resource: " + saved.getName());

        return ResourceDto.fromEntity(saved);
    }

    @Transactional
    public void deleteResource(Long id, String userEmail, Long userId) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));

        auditLogService.log(userId, userEmail, "RESOURCE_DELETE", "Resource", resource.getId(),
                "Deleted resource: " + resource.getName());
        resourceRepository.delete(resource);
    }
}
