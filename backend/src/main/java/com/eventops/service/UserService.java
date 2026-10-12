package com.eventops.service;

import com.eventops.dto.UserDto;
import com.eventops.entity.Role;
import com.eventops.entity.User;
import com.eventops.exception.ResourceNotFoundException;
import com.eventops.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public UserService(UserRepository userRepository, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserDto> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public List<UserDto> searchUsers(String query) {
        if (query == null || query.isBlank()) {
            return getAllUsers();
        }
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto updateUserRole(Long id, Role role, String adminEmail, Long adminId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        Role oldRole = user.getRole();
        user.setRole(role);
        User updated = userRepository.save(user);

        auditLogService.log(adminId, adminEmail, "USER_ROLE_UPDATE", "User", user.getId(),
                "Changed role of " + user.getEmail() + " from " + oldRole + " to " + role);

        return UserDto.fromEntity(updated);
    }

    @Transactional
    public UserDto toggleUserStatus(Long id, String adminEmail, Long adminId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setActive(!user.isActive());
        User updated = userRepository.save(user);

        auditLogService.log(adminId, adminEmail, "USER_STATUS_TOGGLE", "User", user.getId(),
                "Changed active status of " + user.getEmail() + " to " + user.isActive());

        return UserDto.fromEntity(updated);
    }
}
