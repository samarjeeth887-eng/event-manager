package com.eventops.service;

import com.eventops.dto.VendorDto;
import com.eventops.dto.VendorRequest;
import com.eventops.entity.Event;
import com.eventops.entity.PaymentStatus;
import com.eventops.entity.Vendor;
import com.eventops.exception.ResourceNotFoundException;
import com.eventops.repository.EventRepository;
import com.eventops.repository.VendorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;
    private final EventRepository eventRepository;
    private final AuditLogService auditLogService;

    public VendorService(VendorRepository vendorRepository,
                         EventRepository eventRepository,
                         AuditLogService auditLogService) {
        this.vendorRepository = vendorRepository;
        this.eventRepository = eventRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<VendorDto> getAllVendors() {
        return vendorRepository.findAll(Sort.by("name").ascending()).stream()
                .map(VendorDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VendorDto getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
        return VendorDto.fromEntity(vendor);
    }

    @Transactional(readOnly = true)
    public List<VendorDto> getVendorsByEventId(Long eventId) {
        return vendorRepository.findByEventId(eventId).stream()
                .map(VendorDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<VendorDto> searchVendors(String category, PaymentStatus paymentStatus, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return vendorRepository.searchVendors(
                (category != null && !category.isBlank()) ? category.trim() : null,
                paymentStatus,
                (query != null && !query.isBlank()) ? query.trim() : null,
                pageable
        ).map(VendorDto::fromEntity);
    }

    @Transactional
    public VendorDto createVendor(VendorRequest request, String userEmail, Long userId) {
        Event event = null;
        if (request.getEventId() != null) {
            event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));
        }

        Vendor vendor = new Vendor(
                request.getName().trim(),
                request.getContactPerson().trim(),
                request.getPhone().trim(),
                request.getEmail().trim(),
                request.getCategory().trim(),
                request.getService().trim(),
                request.getContractAmount(),
                request.getPaymentStatus() != null ? request.getPaymentStatus() : PaymentStatus.PENDING,
                event,
                request.getNotes()
        );

        Vendor saved = vendorRepository.save(vendor);
        auditLogService.log(userId, userEmail, "VENDOR_CREATE", "Vendor", saved.getId(),
                "Registered vendor: " + saved.getName() + " for service " + saved.getService());

        return VendorDto.fromEntity(saved);
    }

    @Transactional
    public VendorDto updateVendor(Long id, VendorRequest request, String userEmail, Long userId) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));

        vendor.setName(request.getName().trim());
        vendor.setContactPerson(request.getContactPerson().trim());
        vendor.setPhone(request.getPhone().trim());
        vendor.setEmail(request.getEmail().trim());
        vendor.setCategory(request.getCategory().trim());
        vendor.setService(request.getService().trim());
        vendor.setContractAmount(request.getContractAmount());
        if (request.getPaymentStatus() != null) {
            vendor.setPaymentStatus(request.getPaymentStatus());
        }
        if (request.getEventId() != null) {
            Event event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));
            vendor.setEvent(event);
        } else {
            vendor.setEvent(null);
        }
        vendor.setNotes(request.getNotes());

        Vendor saved = vendorRepository.save(vendor);
        auditLogService.log(userId, userEmail, "VENDOR_UPDATE", "Vendor", saved.getId(),
                "Updated vendor: " + saved.getName());

        return VendorDto.fromEntity(saved);
    }

    @Transactional
    public void deleteVendor(Long id, String userEmail, Long userId) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));

        auditLogService.log(userId, userEmail, "VENDOR_DELETE", "Vendor", vendor.getId(),
                "Deleted vendor: " + vendor.getName());
        vendorRepository.delete(vendor);
    }
}
