package com.eventops.dto;

import com.eventops.entity.PaymentStatus;
import com.eventops.entity.Vendor;
import java.time.LocalDateTime;

public class VendorDto {
    private Long id;
    private String name;
    private String contactPerson;
    private String phone;
    private String email;
    private String category;
    private String service;
    private Double contractAmount;
    private PaymentStatus paymentStatus;
    private Long eventId;
    private String eventName;
    private String notes;
    private LocalDateTime createdAt;

    public VendorDto() {
    }

    public static VendorDto fromEntity(Vendor vendor) {
        if (vendor == null) return null;
        VendorDto dto = new VendorDto();
        dto.setId(vendor.getId());
        dto.setName(vendor.getName());
        dto.setContactPerson(vendor.getContactPerson());
        dto.setPhone(vendor.getPhone());
        dto.setEmail(vendor.getEmail());
        dto.setCategory(vendor.getCategory());
        dto.setService(vendor.getService());
        dto.setContractAmount(vendor.getContractAmount());
        dto.setPaymentStatus(vendor.getPaymentStatus());
        if (vendor.getEvent() != null) {
            dto.setEventId(vendor.getEvent().getId());
            dto.setEventName(vendor.getEvent().getName());
        }
        dto.setNotes(vendor.getNotes());
        dto.setCreatedAt(vendor.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public Double getContractAmount() {
        return contractAmount;
    }

    public void setContractAmount(Double contractAmount) {
        this.contractAmount = contractAmount;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
