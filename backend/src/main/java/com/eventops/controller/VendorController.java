package com.eventops.controller;

import com.eventops.dto.ApiResponse;
import com.eventops.dto.VendorDto;
import com.eventops.dto.VendorRequest;
import com.eventops.entity.PaymentStatus;
import com.eventops.security.UserPrincipal;
import com.eventops.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VendorDto>>> getAllVendors() {
        return ResponseEntity.ok(ApiResponse.success(vendorService.getAllVendors()));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<VendorDto>>> getVendorsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success(vendorService.getVendorsByEventId(eventId)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<VendorDto>>> searchVendors(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<VendorDto> result = vendorService.searchVendors(category, paymentStatus, query, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorDto>> getVendorById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(vendorService.getVendorById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<VendorDto>> createVendor(
            @Valid @RequestBody VendorRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        VendorDto created = vendorService.createVendor(request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Vendor created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<VendorDto>> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody VendorRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        VendorDto updated = vendorService.updateVendor(id, request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Vendor updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteVendor(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        vendorService.deleteVendor(id, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Vendor deleted successfully", null));
    }
}
