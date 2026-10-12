package com.eventops.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // Audio/Visual, Computing, Furniture, Facility, Catering, Logistics

    @Column(nullable = false)
    private Integer totalQuantity;

    @Column(nullable = false)
    private Integer availableQuantity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id")
    private Event event; // Nullable if general inventory

    @Column(nullable = false)
    private String status = "AVAILABLE"; // AVAILABLE, PARTIALLY_ALLOCATED, OUT_OF_STOCK

    private Double unitCost;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Resource() {
    }

    public Resource(String name, String category, Integer totalQuantity, Integer availableQuantity,
                    Event event, String status, Double unitCost) {
        this.name = name;
        this.category = category;
        this.totalQuantity = totalQuantity;
        this.availableQuantity = availableQuantity != null ? availableQuantity : totalQuantity;
        this.event = event;
        this.status = status != null ? status : "AVAILABLE";
        this.unitCost = unitCost;
        this.createdAt = LocalDateTime.now();
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Integer totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(Double unitCost) {
        this.unitCost = unitCost;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
