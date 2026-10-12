package com.eventops.repository;

import com.eventops.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByEventId(Long eventId);
    List<Team> findByTeamLeadId(Long teamLeadId);
}
