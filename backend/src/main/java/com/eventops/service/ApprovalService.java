package com.eventops.service;

import com.eventops.dto.CreateResourceRequestDto;
import com.eventops.dto.ResourceRequestDto;
import com.eventops.entity.*;
import com.eventops.exception.BadRequestException;
import com.eventops.exception.ResourceNotFoundException;
import com.eventops.repository.EventRepository;
import com.eventops.repository.ResourceRepository;
import com.eventops.repository.ResourceRequestRepository;
import com.eventops.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApprovalService {

    private final ResourceRequestRepository requestRepository;
    private final ResourceRepository resourceRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public ApprovalService(ResourceRequestRepository requestRepository,
                           ResourceRepository resourceRepository,
                           EventRepository eventRepository,
                           UserRepository userRepository,
                           AuditLogService auditLogService) {
        this.requestRepository = requestRepository;
        this.resourceRepository = resourceRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<ResourceRequestDto> getAllRequests() {
        return requestRepository.findAll(Sort.by("requestedAt").descending()).stream()
                .map(ResourceRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResourceRequestDto> getRequestsByStatus(ApprovalStatus status) {
        return requestRepository.findByStatus(status).stream()
                .map(ResourceRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResourceRequestDto> getRequestsByUser(Long userId) {
        return requestRepository.findByRequestedById(userId).stream()
                .map(ResourceRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResourceRequestDto> getRequestsByEvent(Long eventId) {
        return requestRepository.findByEventId(eventId).stream()
                .map(ResourceRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ResourceRequestDto> searchRequests(Long eventId, ApprovalStatus status, Long requestedById, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("requestedAt").descending());
        return requestRepository.searchRequests(eventId, status, requestedById, pageable)
                .map(ResourceRequestDto::fromEntity);
    }

    @Transactional
    public ResourceRequestDto createRequest(CreateResourceRequestDto dto, String userEmail, Long userId) {
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + dto.getEventId()));

        Resource resource = resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + dto.getResourceId()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (dto.getQuantity() <= 0) {
            throw new BadRequestException("Requested quantity must be greater than zero.");
        }

        if (dto.getQuantity() > resource.getAvailableQuantity()) {
            throw new BadRequestException("Requested quantity (" + dto.getQuantity() +
                    ") exceeds currently available quantity (" + resource.getAvailableQuantity() + ").");
        }

        ResourceRequest req = new ResourceRequest(event, resource, user, dto.getQuantity(), dto.getPurpose());
        ResourceRequest saved = requestRepository.save(req);

        auditLogService.log(userId, userEmail, "RESOURCE_REQUEST_CREATE", "ResourceRequest", saved.getId(),
                "Requested " + dto.getQuantity() + " units of " + resource.getName() + " for event " + event.getName());

        return ResourceRequestDto.fromEntity(saved);
    }

    @Transactional
    public ResourceRequestDto approveRequest(Long requestId, String comment, String reviewerEmail, Long reviewerId) {
        ResourceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        if (req.getStatus() != ApprovalStatus.PENDING) {
            throw new BadRequestException("Only pending requests can be approved. Current status: " + req.getStatus());
        }

        Resource resource = req.getResource();
        if (resource.getAvailableQuantity() < req.getQuantity()) {
            throw new BadRequestException("Insufficient resource inventory. Available: " +
                    resource.getAvailableQuantity() + ", Required: " + req.getQuantity());
        }

        // Deduct inventory
        resource.setAvailableQuantity(resource.getAvailableQuantity() - req.getQuantity());
        if (resource.getAvailableQuantity() == 0) {
            resource.setStatus("OUT_OF_STOCK");
        } else {
            resource.setStatus("PARTIALLY_ALLOCATED");
        }
        resourceRepository.save(resource);

        User reviewer = userRepository.findById(reviewerId).orElse(null);
        req.setStatus(ApprovalStatus.APPROVED);
        req.setReviewedBy(reviewer);
        req.setReviewedAt(LocalDateTime.now());
        if (comment != null && !comment.isBlank()) {
            req.setApproverComments(comment);
        }

        ResourceRequest saved = requestRepository.save(req);
        auditLogService.log(reviewerId, reviewerEmail, "RESOURCE_REQUEST_APPROVED", "ResourceRequest", saved.getId(),
                "Approved request for " + req.getQuantity() + " " + resource.getName() + " by " + req.getRequestedBy().getName());

        return ResourceRequestDto.fromEntity(saved);
    }

    @Transactional
    public ResourceRequestDto rejectRequest(Long requestId, String comment, String reviewerEmail, Long reviewerId) {
        ResourceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        if (req.getStatus() != ApprovalStatus.PENDING) {
            throw new BadRequestException("Only pending requests can be rejected. Current status: " + req.getStatus());
        }

        User reviewer = userRepository.findById(reviewerId).orElse(null);
        req.setStatus(ApprovalStatus.REJECTED);
        req.setReviewedBy(reviewer);
        req.setReviewedAt(LocalDateTime.now());
        req.setApproverComments(comment != null ? comment : "Request rejected by administrator.");

        ResourceRequest saved = requestRepository.save(req);
        auditLogService.log(reviewerId, reviewerEmail, "RESOURCE_REQUEST_REJECTED", "ResourceRequest", saved.getId(),
                "Rejected request for " + req.getResource().getName() + " (Reason: " + req.getApproverComments() + ")");

        return ResourceRequestDto.fromEntity(saved);
    }
}
