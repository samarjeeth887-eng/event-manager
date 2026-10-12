package com.eventops.dto;

import com.eventops.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;

public class TaskStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private TaskStatus status;

    private String comment;

    public TaskStatusUpdateRequest() {
    }

    public TaskStatusUpdateRequest(TaskStatus status, String comment) {
        this.status = status;
        this.comment = comment;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
