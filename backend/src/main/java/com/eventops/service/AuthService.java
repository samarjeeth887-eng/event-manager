package com.eventops.service;

import com.eventops.dto.AuthRequest;
import com.eventops.dto.AuthResponse;
import com.eventops.dto.RegisterRequest;
import com.eventops.dto.UserDto;
import com.eventops.entity.Role;
import com.eventops.entity.User;
import com.eventops.exception.BadRequestException;
import com.eventops.repository.UserRepository;
import com.eventops.security.JwtTokenProvider;
import com.eventops.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuditLogService auditLogService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        auditLogService.log(user.getId(), user.getEmail(), "USER_LOGIN", "User", user.getId(), "User logged in successfully");

        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email address already registered: " + email);
        }

        Role role = request.getRole() != null ? request.getRole() : Role.VOLUNTEER;

        User user = new User(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                role,
                request.getPhone(),
                request.getDepartment()
        );

        User savedUser = userRepository.save(user);

        auditLogService.log(savedUser.getId(), savedUser.getEmail(), "USER_REGISTER", "User", savedUser.getId(),
                "Registered new user with role " + savedUser.getRole());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            return null;
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));
        return UserDto.fromEntity(user);
    }
}
