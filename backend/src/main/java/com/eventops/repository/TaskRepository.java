package com.eventops.repository;

import com.eventops.entity.Task;
import com.eventops.entity.TaskPriority;
import com.eventops.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByEventId(Long eventId);
    List<Task> findByTeamId(Long teamId);
    List<Task> findByAssignedUserId(Long assignedUserId);
    List<Task> findByAssignedUserIdAndStatus(Long assignedUserId, TaskStatus status);
    long countByStatus(TaskStatus status);
    long countByEventIdAndStatus(Long eventId, TaskStatus status);
    long countByAssignedUserIdAndStatus(Long assignedUserId, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE " +
           "(:eventId IS NULL OR t.event.id = :eventId) AND " +
           "(:teamId IS NULL OR t.team.id = :teamId) AND " +
           "(:assignedUserId IS NULL OR t.assignedUser.id = :assignedUserId) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:query IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Task> searchTasks(@Param("eventId") Long eventId,
                           @Param("teamId") Long teamId,
                           @Param("assignedUserId") Long assignedUserId,
                           @Param("status") TaskStatus status,
                           @Param("priority") TaskPriority priority,
                           @Param("query") String query,
                           Pageable pageable);
}
