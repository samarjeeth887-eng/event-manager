package com.eventops.service;

import com.eventops.dto.*;
import com.eventops.entity.*;
import com.eventops.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final EventRepository eventRepository;
    private final TaskRepository taskRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final AuditLogRepository auditLogRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    public DashboardService(EventRepository eventRepository,
                            TaskRepository taskRepository,
                            ResourceRepository resourceRepository,
                            ResourceRequestRepository requestRepository,
                            UserRepository userRepository,
                            VendorRepository vendorRepository,
                            AuditLogRepository auditLogRepository,
                            TeamRepository teamRepository,
                            TeamMemberRepository teamMemberRepository) {
        this.eventRepository = eventRepository;
        this.taskRepository = taskRepository;
        this.resourceRepository = resourceRepository;
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
        this.auditLogRepository = auditLogRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getAdminStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        // Events
        stats.setTotalEvents(eventRepository.count());
        stats.setActiveEvents(eventRepository.countByStatus(EventStatus.ONGOING));
        stats.setUpcomingEvents(eventRepository.countByStatus(EventStatus.UPCOMING));
        stats.setCompletedEvents(eventRepository.countByStatus(EventStatus.COMPLETED));

        // Approvals
        stats.setPendingApprovals(requestRepository.countByStatus(ApprovalStatus.PENDING));

        // Users & Volunteers
        stats.setTotalUsers(userRepository.count());
        stats.setTotalVolunteers(userRepository.countByRole(Role.VOLUNTEER));

        // Tasks
        stats.setTotalTasks(taskRepository.count());
        stats.setPendingTasks(taskRepository.countByStatus(TaskStatus.PENDING));
        stats.setInProgressTasks(taskRepository.countByStatus(TaskStatus.IN_PROGRESS));
        stats.setCompletedTasks(taskRepository.countByStatus(TaskStatus.COMPLETED));

        // Resources
        long totalRes = resourceRepository.sumTotalQuantity();
        long availRes = resourceRepository.sumAvailableQuantity();
        stats.setTotalResources(totalRes);
        stats.setAvailableResources(availRes);
        stats.setAllocatedResources(Math.max(0, totalRes - availRes));

        // Vendors
        stats.setTotalVendors(vendorRepository.count());
        stats.setTotalContractAmount(vendorRepository.sumTotalContracts());

        // Recent lists
        List<EventDto> recentEvents = eventRepository.findAll(
                PageRequest.of(0, 5, Sort.by("startDate").ascending())
        ).getContent().stream().map(EventDto::fromEntity).collect(Collectors.toList());
        stats.setRecentEvents(recentEvents);

        List<TaskDto> urgentTasks = taskRepository.findAll(Sort.by("deadline").ascending())
                .stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .limit(5)
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
        stats.setUrgentTasks(urgentTasks);

        List<AuditLogDto> recentActivities = auditLogRepository.findTop10ByOrderByTimestampDesc()
                .stream()
                .map(AuditLogDto::fromEntity)
                .collect(Collectors.toList());
        stats.setRecentActivities(recentActivities);

        List<ResourceRequestDto> pendingRequests = requestRepository.findByStatus(ApprovalStatus.PENDING)
                .stream()
                .limit(5)
                .map(ResourceRequestDto::fromEntity)
                .collect(Collectors.toList());
        stats.setPendingRequestsList(pendingRequests);

        return stats;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getCoordinatorStats(Long coordinatorId) {
        DashboardStatsDto stats = getAdminStats();

        // Filter pending requests for this coordinator
        List<ResourceRequestDto> myRequests = requestRepository.findByRequestedById(coordinatorId)
                .stream()
                .map(ResourceRequestDto::fromEntity)
                .collect(Collectors.toList());
        stats.setPendingRequestsList(myRequests);

        return stats;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getTeamLeadStats(Long leadId) {
        DashboardStatsDto stats = new DashboardStatsDto();

        List<Team> leadTeams = teamRepository.findByTeamLeadId(leadId);
        long teamMemberCount = 0;
        long totalTasks = 0;
        long pendingTasks = 0;
        long inProgressTasks = 0;
        long completedTasks = 0;

        for (Team t : leadTeams) {
            teamMemberCount += teamMemberRepository.findByTeamId(t.getId()).size();
            List<Task> tasks = taskRepository.findByTeamId(t.getId());
            totalTasks += tasks.size();
            for (Task task : tasks) {
                if (task.getStatus() == TaskStatus.PENDING) pendingTasks++;
                else if (task.getStatus() == TaskStatus.IN_PROGRESS) inProgressTasks++;
                else if (task.getStatus() == TaskStatus.COMPLETED) completedTasks++;
            }
        }

        stats.setTotalVolunteers(teamMemberCount);
        stats.setTotalTasks(totalTasks);
        stats.setPendingTasks(pendingTasks);
        stats.setInProgressTasks(inProgressTasks);
        stats.setCompletedTasks(completedTasks);

        return stats;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getVolunteerStats(Long volunteerId) {
        DashboardStatsDto stats = new DashboardStatsDto();

        List<Task> myTasks = taskRepository.findByAssignedUserId(volunteerId);
        long pending = 0;
        long inProgress = 0;
        long completed = 0;

        for (Task t : myTasks) {
            if (t.getStatus() == TaskStatus.PENDING) pending++;
            else if (t.getStatus() == TaskStatus.IN_PROGRESS) inProgress++;
            else if (t.getStatus() == TaskStatus.COMPLETED) completed++;
        }

        stats.setTotalTasks(myTasks.size());
        stats.setPendingTasks(pending);
        stats.setInProgressTasks(inProgress);
        stats.setCompletedTasks(completed);

        return stats;
    }
}
