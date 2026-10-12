package com.eventops.controller;

import com.eventops.dto.ApiResponse;
import com.eventops.dto.EventDto;
import com.eventops.dto.EventRequest;
import com.eventops.entity.EventStatus;
import com.eventops.security.UserPrincipal;
import com.eventops.service.EventService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventDto>>> getAllEvents() {
        List<EventDto> events = eventService.getAllEvents();
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<EventDto>>> searchEvents(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<EventDto> result = eventService.searchEvents(query, category, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventDto>> getEventById(@PathVariable Long id) {
        EventDto event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success(event));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<EventDto>> createEvent(
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        EventDto created = eventService.createEvent(request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<EventDto>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        EventDto updated = eventService.updateEvent(id, request, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        eventService.deleteEvent(id, currentUser.getUsername(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
}
