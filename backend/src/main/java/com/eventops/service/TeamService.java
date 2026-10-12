package com.eventops.service;

import com.eventops.dto.TeamDto;
import com.eventops.dto.TeamMemberDto;
import com.eventops.dto.TeamMemberRequest;
import com.eventops.dto.TeamRequest;
import com.eventops.entity.Event;
import com.eventops.entity.Team;
import com.eventops.entity.TeamMember;
import com.eventops.entity.User;
import com.eventops.exception.BadRequestException;
import com.eventops.exception.ResourceNotFoundException;
import com.eventops.repository.EventRepository;
import com.eventops.repository.TeamMemberRepository;
import com.eventops.repository.TeamRepository;
import com.eventops.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public TeamService(TeamRepository teamRepository,
                       TeamMemberRepository teamMemberRepository,
                       EventRepository eventRepository,
                       UserRepository userRepository,
                       AuditLogService auditLogService) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    private TeamDto toDtoWithCount(Team team) {
        TeamDto dto = TeamDto.fromEntity(team);
        if (dto != null) {
            dto.setMemberCount(teamMemberRepository.findByTeamId(team.getId()).size());
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public List<TeamDto> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::toDtoWithCount)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeamDto> getTeamsByEventId(Long eventId) {
        return teamRepository.findByEventId(eventId).stream()
                .map(this::toDtoWithCount)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeamDto getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));
        return toDtoWithCount(team);
    }

    @Transactional(readOnly = true)
    public List<TeamDto> getTeamsByLeadId(Long leadId) {
        return teamRepository.findByTeamLeadId(leadId).stream()
                .map(this::toDtoWithCount)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeamDto> getTeamsForUser(Long userId) {
        List<TeamMember> memberships = teamMemberRepository.findByUserId(userId);
        return memberships.stream()
                .map(m -> toDtoWithCount(m.getTeam()))
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional
    public TeamDto createTeam(TeamRequest request, String userEmail, Long userId) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));

        User teamLead = null;
        if (request.getTeamLeadId() != null) {
            teamLead = userRepository.findById(request.getTeamLeadId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getTeamLeadId()));
        }

        Team team = new Team(request.getName().trim(), request.getDescription(), event, teamLead, request.getStatus());
        Team saved = teamRepository.save(team);

        if (teamLead != null) {
            // Also add team lead to members
            TeamMember leadMember = new TeamMember(saved, teamLead, "LEAD");
            teamMemberRepository.save(leadMember);
        }

        auditLogService.log(userId, userEmail, "TEAM_CREATE", "Team", saved.getId(),
                "Created team: " + saved.getName() + " for event " + event.getName());

        return toDtoWithCount(saved);
    }

    @Transactional
    public TeamDto updateTeam(Long id, TeamRequest request, String userEmail, Long userId) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));

        team.setName(request.getName().trim());
        team.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            team.setStatus(request.getStatus());
        }

        if (request.getTeamLeadId() != null) {
            User newLead = userRepository.findById(request.getTeamLeadId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getTeamLeadId()));
            team.setTeamLead(newLead);
            if (!teamMemberRepository.existsByTeamIdAndUserId(team.getId(), newLead.getId())) {
                teamMemberRepository.save(new TeamMember(team, newLead, "LEAD"));
            }
        }

        Team saved = teamRepository.save(team);
        auditLogService.log(userId, userEmail, "TEAM_UPDATE", "Team", saved.getId(),
                "Updated team: " + saved.getName());

        return toDtoWithCount(saved);
    }

    @Transactional
    public void deleteTeam(Long id, String userEmail, Long userId) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));

        auditLogService.log(userId, userEmail, "TEAM_DELETE", "Team", team.getId(),
                "Deleted team: " + team.getName());
        teamRepository.delete(team);
    }

    @Transactional(readOnly = true)
    public List<TeamMemberDto> getTeamMembers(Long teamId) {
        return teamMemberRepository.findByTeamId(teamId).stream()
                .map(TeamMemberDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public TeamMemberDto addMember(TeamMemberRequest request, String userEmail, Long userId) {
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.getTeamId()));

        User memberUser = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (teamMemberRepository.existsByTeamIdAndUserId(team.getId(), memberUser.getId())) {
            throw new BadRequestException("User is already a member of this team.");
        }

        TeamMember member = new TeamMember(team, memberUser, request.getRoleInTeam());
        TeamMember saved = teamMemberRepository.save(member);

        auditLogService.log(userId, userEmail, "TEAM_MEMBER_ADD", "TeamMember", saved.getId(),
                "Added user " + memberUser.getName() + " to team " + team.getName());

        return TeamMemberDto.fromEntity(saved);
    }

    @Transactional
    public void removeMember(Long teamId, Long memberUserId, String userEmail, Long userId) {
        TeamMember member = teamMemberRepository.findByTeamIdAndUserId(teamId, memberUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Team membership not found"));

        auditLogService.log(userId, userEmail, "TEAM_MEMBER_REMOVE", "TeamMember", member.getId(),
                "Removed user " + member.getUser().getName() + " from team " + member.getTeam().getName());

        teamMemberRepository.delete(member);
    }
}
