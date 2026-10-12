package com.eventops.service;

import com.eventops.dto.TaskDto;
import com.eventops.dto.TaskRequest;
import com.eventops.entity.*;
import com.eventops.exception.BadRequestException;
import com.eventops.exception.ResourceNotFoundException;
import com.eventops.exception.UnauthorizedException;
import com.eventops.repository.EventRepository;
import com.eventops.repository.TaskRepository;
import com.eventops.repository.TeamRepository;
import com.eventops.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final EventRepository eventRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public TaskService(TaskRepository taskRepository,
                       EventRepository eventRepository,
                       TeamRepository teamRepository,
                       UserRepository userRepository,
                       AuditLogService auditLogService) {
        this.taskRepository = taskRepository;
        this.eventRepository = eventRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll(Sort.by("deadline").ascending()).stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return TaskDto.fromEntity(task);
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByEventId(Long eventId) {
        return taskRepository.findByEventId(eventId).stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByTeamId(Long teamId) {
        return taskRepository.findByTeamId(teamId).stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByAssignedUserId(Long userId) {
        return taskRepository.findByAssignedUserId(userId).stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<TaskDto> searchTasks(Long eventId, Long teamId, Long assignedUserId,
                                     TaskStatus status, TaskPriority priority, String query,
                                     int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("deadline").ascending());
        return taskRepository.searchTasks(
                eventId,
                teamId,
                assignedUserId,
                status,
                priority,
                (query != null && !query.isBlank()) ? query.trim() : null,
                pageable
        ).map(TaskDto::fromEntity);
    }

    @Transactional
    public TaskDto createTask(TaskRequest request, String userEmail, Long userId) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));

        Team team = null;
        if (request.getTeamId() != null) {
            team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.getTeamId()));
        }

        User assignedUser = null;
        if (request.getAssignedUserId() != null) {
            assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedUserId()));
        }

        Task task = new Task(
                request.getTitle().trim(),
                request.getDescription(),
                event,
                team,
                assignedUser,
                request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM,
                request.getStatus() != null ? request.getStatus() : TaskStatus.PENDING,
                request.getDeadline()
        );

        Task saved = taskRepository.save(task);
        auditLogService.log(userId, userEmail, "TASK_CREATE", "Task", saved.getId(),
                "Created task: " + saved.getTitle() + (assignedUser != null ? " assigned to " + assignedUser.getName() : ""));

        return TaskDto.fromEntity(saved);
    }

    @Transactional
    public TaskDto updateTask(Long id, TaskRequest request, String userEmail, Long userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        task.setDeadline(request.getDeadline());

        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.getTeamId()));
            task.setTeam(team);
        }

        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedUserId()));
            task.setAssignedUser(assignedUser);
        } else {
            task.setAssignedUser(null);
        }

        Task saved = taskRepository.save(task);
        auditLogService.log(userId, userEmail, "TASK_UPDATE", "Task", saved.getId(),
                "Updated task: " + saved.getTitle());

        return TaskDto.fromEntity(saved);
    }

    @Transactional
    public TaskDto updateTaskStatus(Long id, TaskStatus status, String comment,
                                    String userEmail, Long userId, Role userRole) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        // Volunteer can only update status of task assigned to them
        if (userRole == Role.VOLUNTEER) {
            if (task.getAssignedUser() == null || !task.getAssignedUser().getId().equals(userId)) {
                throw new UnauthorizedException("You are only permitted to update tasks assigned directly to you.");
            }
        }

        TaskStatus oldStatus = task.getStatus();
        task.setStatus(status);
        Task saved = taskRepository.save(task);

        String detailMsg = "Status changed from " + oldStatus + " to " + status;
        if (comment != null && !comment.isBlank()) {
            detailMsg += " (Note: " + comment + ")";
        }

        auditLogService.log(userId, userEmail, "TASK_STATUS_UPDATE", "Task", saved.getId(), detailMsg);

        return TaskDto.fromEntity(saved);
    }

    @Transactional
    public void deleteTask(Long id, String userEmail, Long userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        auditLogService.log(userId, userEmail, "TASK_DELETE", "Task", task.getId(),
                "Deleted task: " + task.getTitle());
        taskRepository.delete(task);
    }
}
