package com.eventops.dto;

import java.util.List;

public class DashboardStatsDto {
    private long totalEvents;
    private long activeEvents;
    private long upcomingEvents;
    private long completedEvents;
    private long pendingApprovals;
    private long totalVolunteers;
    private long totalUsers;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long totalTasks;
    private long totalResources;
    private long availableResources;
    private long allocatedResources;
    private long totalVendors;
    private double totalContractAmount;

    private List<EventDto> recentEvents;
    private List<TaskDto> urgentTasks;
    private List<AuditLogDto> recentActivities;
    private List<ResourceRequestDto> pendingRequestsList;

    public DashboardStatsDto() {
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getActiveEvents() {
        return activeEvents;
    }

    public void setActiveEvents(long activeEvents) {
        this.activeEvents = activeEvents;
    }

    public long getUpcomingEvents() {
        return upcomingEvents;
    }

    public void setUpcomingEvents(long upcomingEvents) {
        this.upcomingEvents = upcomingEvents;
    }

    public long getCompletedEvents() {
        return completedEvents;
    }

    public void setCompletedEvents(long completedEvents) {
        this.completedEvents = completedEvents;
    }

    public long getPendingApprovals() {
        return pendingApprovals;
    }

    public void setPendingApprovals(long pendingApprovals) {
        this.pendingApprovals = pendingApprovals;
    }

    public long getTotalVolunteers() {
        return totalVolunteers;
    }

    public void setTotalVolunteers(long totalVolunteers) {
        this.totalVolunteers = totalVolunteers;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getTotalResources() {
        return totalResources;
    }

    public void setTotalResources(long totalResources) {
        this.totalResources = totalResources;
    }

    public long getAvailableResources() {
        return availableResources;
    }

    public void setAvailableResources(long availableResources) {
        this.availableResources = availableResources;
    }

    public long getAllocatedResources() {
        return allocatedResources;
    }

    public void setAllocatedResources(long allocatedResources) {
        this.allocatedResources = allocatedResources;
    }

    public long getTotalVendors() {
        return totalVendors;
    }

    public void setTotalVendors(long totalVendors) {
        this.totalVendors = totalVendors;
    }

    public double getTotalContractAmount() {
        return totalContractAmount;
    }

    public void setTotalContractAmount(double totalContractAmount) {
        this.totalContractAmount = totalContractAmount;
    }

    public List<EventDto> getRecentEvents() {
        return recentEvents;
    }

    public void setRecentEvents(List<EventDto> recentEvents) {
        this.recentEvents = recentEvents;
    }

    public List<TaskDto> getUrgentTasks() {
        return urgentTasks;
    }

    public void setUrgentTasks(List<TaskDto> urgentTasks) {
        this.urgentTasks = urgentTasks;
    }

    public List<AuditLogDto> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<AuditLogDto> recentActivities) {
        this.recentActivities = recentActivities;
    }

    public List<ResourceRequestDto> getPendingRequestsList() {
        return pendingRequestsList;
    }

    public void setPendingRequestsList(List<ResourceRequestDto> pendingRequestsList) {
        this.pendingRequestsList = pendingRequestsList;
    }
}
