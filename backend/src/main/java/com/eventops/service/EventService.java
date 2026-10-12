package com.eventops.service;

import com.eventops.dto.EventDto;
import com.eventops.dto.EventRequest;
import com.eventops.entity.Event;
import com.eventops.entity.EventStatus;
import com.eventops.exception.BadRequestException;
import com.eventops.exception.ResourceNotFoundException;
import com.eventops.repository.EventRepository;
import com.eventops.repository.TaskRepository;
import com.eventops.repository.TeamRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final TeamRepository teamRepository;
    private final TaskRepository taskRepository;
    private final AuditLogService auditLogService;

    public EventService(EventRepository eventRepository,
                        TeamRepository teamRepository,
                        TaskRepository taskRepository,
                        AuditLogService auditLogService) {
        this.eventRepository = eventRepository;
        this.teamRepository = teamRepository;
        this.taskRepository = taskRepository;
        this.auditLogService = auditLogService;
    }

    private EventDto toDtoWithCounts(Event event) {
        EventDto dto = EventDto.fromEntity(event);
        if (dto != null) {
            dto.setTeamCount(teamRepository.findByEventId(event.getId()).size());
            dto.setTaskCount(taskRepository.findByEventId(event.getId()).size());
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public List<EventDto> getAllEvents() {
        return eventRepository.findAll(Sort.by("startDate").ascending()).stream()
                .map(this::toDtoWithCounts)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return toDtoWithCounts(event);
    }

    @Transactional(readOnly = true)
    public Page<EventDto> searchEvents(String query, String category, EventStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("startDate").descending());
        return eventRepository.searchEvents(
                (query != null && !query.isBlank()) ? query.trim() : null,
                (category != null && !category.isBlank()) ? category.trim() : null,
                status,
                pageable
        ).map(this::toDtoWithCounts);
    }

    @Transactional
    public EventDto createEvent(EventRequest request, String userEmail, Long userId) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date.");
        }

        Event event = new Event(
                request.getName().trim(),
                request.getDescription(),
                request.getCategory().trim(),
                request.getStartDate(),
                request.getEndDate(),
                request.getVenue().trim(),
                request.getOrganizer().trim(),
                request.getStatus() != null ? request.getStatus() : EventStatus.UPCOMING,
                request.getMaxParticipants(),
                request.getBudget()
        );

        Event saved = eventRepository.save(event);
        auditLogService.log(userId, userEmail, "EVENT_CREATE", "Event", saved.getId(),
                "Created event: " + saved.getName());

        return toDtoWithCounts(saved);
    }

    @Transactional
    public EventDto updateEvent(Long id, EventRequest request, String userEmail, Long userId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date.");
        }

        event.setName(request.getName().trim());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory().trim());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setVenue(request.getVenue().trim());
        event.setOrganizer(request.getOrganizer().trim());
        if (request.getStatus() != null) {
            event.setStatus(request.getStatus());
        }
        event.setMaxParticipants(request.getMaxParticipants());
        event.setBudget(request.getBudget());

        Event saved = eventRepository.save(event);
        auditLogService.log(userId, userEmail, "EVENT_UPDATE", "Event", saved.getId(),
                "Updated event: " + saved.getName() + " (Status: " + saved.getStatus() + ")");

        return toDtoWithCounts(saved);
    }

    @Transactional
    public void deleteEvent(Long id, String userEmail, Long userId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        auditLogService.log(userId, userEmail, "EVENT_DELETE", "Event", event.getId(),
                "Deleted event: " + event.getName());
        eventRepository.delete(event);
    }
}
