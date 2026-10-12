package com.eventops.config;

import com.eventops.entity.*;
import com.eventops.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TaskRepository taskRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceRequestRepository resourceRequestRepository;
    private final VendorRepository vendorRepository;
    private final AuditLogRepository auditLogRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           EventRepository eventRepository,
                           TeamRepository teamRepository,
                           TeamMemberRepository teamMemberRepository,
                           TaskRepository taskRepository,
                           ResourceRepository resourceRepository,
                           ResourceRequestRepository resourceRequestRepository,
                           VendorRepository vendorRepository,
                           AuditLogRepository auditLogRepository,
                           AnnouncementRepository announcementRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.taskRepository = taskRepository;
        this.resourceRepository = resourceRepository;
        this.resourceRequestRepository = resourceRequestRepository;
        this.vendorRepository = vendorRepository;
        this.auditLogRepository = auditLogRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Seed Users
        User admin = userRepository.save(new User(
                "Aarav Sharma", "admin@eventops.com", passwordEncoder.encode("admin123"),
                Role.ADMIN, "9876543201", "Administration"
        ));

        User coord1 = userRepository.save(new User(
                "Sneha Reddy", "coordinator@eventops.com", passwordEncoder.encode("coord123"),
                Role.COORDINATOR, "9876543202", "Events Department"
        ));

        User coord2 = userRepository.save(new User(
                "Kavita Nair", "sarah.coord@eventops.com", passwordEncoder.encode("coord123"),
                Role.COORDINATOR, "9876543203", "Student Affairs"
        ));

        User lead1 = userRepository.save(new User(
                "Rohan Gupta", "teamlead@eventops.com", passwordEncoder.encode("lead123"),
                Role.TEAM_LEAD, "9876543204", "Computer Science"
        ));

        User lead2 = userRepository.save(new User(
                "Priya Sharma", "priya.lead@eventops.com", passwordEncoder.encode("lead123"),
                Role.TEAM_LEAD, "9876543205", "Media & Design"
        ));

        User vol1 = userRepository.save(new User(
                "Karthik Raman", "volunteer@eventops.com", passwordEncoder.encode("vol123"),
                Role.VOLUNTEER, "9876543206", "Information Technology"
        ));

        User vol2 = userRepository.save(new User(
                "Maya Patel", "maya.vol@eventops.com", passwordEncoder.encode("vol123"),
                Role.VOLUNTEER, "9876543207", "Electronics"
        ));

        User vol3 = userRepository.save(new User(
                "Siddharth Rao", "liam.vol@eventops.com", passwordEncoder.encode("vol123"),
                Role.VOLUNTEER, "9876543208", "Mechanical"
        ));

        // 2. Seed Events
        Event event1 = eventRepository.save(new Event(
                "InnovateX 2026 - National Tech Fest",
                "Flagship inter-collegiate technical festival featuring hackathons, paper presentations, project expo, and competitive programming.",
                "Technical",
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(7),
                "Main Auditorium & Tech Complex",
                "Department of Computer Science & Engineering",
                EventStatus.UPCOMING,
                1200,
                150000.0
        ));

        Event event2 = eventRepository.save(new Event(
                "CodeForge 24-Hour Hackathon",
                "Overnight national hackathon solving open-source problems with mentor guidance and incubation opportunities.",
                "Hackathon",
                LocalDate.now().minusDays(1),
                LocalDate.now().plusDays(1),
                "Innovation & Incubation Hub",
                "ACM Student Chapter & Coding Club",
                EventStatus.ONGOING,
                350,
                80000.0
        ));

        Event event3 = eventRepository.save(new Event(
                "Tarang 2026 - Annual Cultural Fest",
                "Three-day celebration of music, dance, theatre, fine arts, and literary performances across the campus.",
                "Cultural",
                LocalDate.now().plusDays(15),
                LocalDate.now().plusDays(18),
                "Open Air Amphitheatre",
                "Student Cultural Council",
                EventStatus.UPCOMING,
                2500,
                250000.0
        ));

        Event event4 = eventRepository.save(new Event(
                "NextGen AI & Cloud Summit",
                "Industry seminar and research paper tracks exploring generative AI architectures, distributed systems, and LLMOps.",
                "Conference",
                LocalDate.now().minusDays(10),
                LocalDate.now().minusDays(8),
                "Convention Center Hall B",
                "AI Research Cell",
                EventStatus.COMPLETED,
                450,
                95000.0
        ));

        // 3. Seed Teams
        Team team1 = teamRepository.save(new Team(
                "Technical & Systems",
                "Oversees network infrastructure, lab machines, live audio-video projections, and software testing.",
                event1, lead1, "ACTIVE"
        ));

        Team team2 = teamRepository.save(new Team(
                "PR, Media & Branding",
                "Social media coverage, press releases, photography, print collaterals, and attendee kits.",
                event1, lead2, "ACTIVE"
        ));

        Team team3 = teamRepository.save(new Team(
                "Logistics & Operations",
                "Venue booking, seating, catering distribution, transportation, and equipment movement.",
                event2, lead1, "ACTIVE"
        ));

        Team team4 = teamRepository.save(new Team(
                "Hospitality & Registration",
                "Guest reception, participant check-in, certificates distribution, and helpdesk desks.",
                event2, lead2, "ACTIVE"
        ));

        // 4. Seed Team Members
        teamMemberRepository.save(new TeamMember(team1, lead1, "LEAD"));
        teamMemberRepository.save(new TeamMember(team1, vol1, "MEMBER"));
        teamMemberRepository.save(new TeamMember(team1, vol2, "MEMBER"));

        teamMemberRepository.save(new TeamMember(team2, lead2, "LEAD"));
        teamMemberRepository.save(new TeamMember(team2, vol2, "MEMBER"));

        teamMemberRepository.save(new TeamMember(team3, lead1, "LEAD"));
        teamMemberRepository.save(new TeamMember(team3, vol3, "MEMBER"));
        teamMemberRepository.save(new TeamMember(team3, vol1, "MEMBER"));

        teamMemberRepository.save(new TeamMember(team4, lead2, "LEAD"));
        teamMemberRepository.save(new TeamMember(team4, vol3, "MEMBER"));

        // 5. Seed Tasks
        taskRepository.save(new Task(
                "Setup Main Stage Projectors & Sound System",
                "Configure dual high-definition laser projectors and test wireless lapel microphones in Hall A.",
                event1, team1, vol1, TaskPriority.URGENT, TaskStatus.IN_PROGRESS, LocalDate.now().plusDays(1)
        ));

        taskRepository.save(new Task(
                "Configure Gigabit Wi-Fi in Hackathon Lab",
                "Deploy backup access points, test bandwidth allocation, and provision guest credentials for all teams.",
                event2, team3, vol1, TaskPriority.HIGH, TaskStatus.COMPLETED, LocalDate.now().minusDays(1)
        ));

        taskRepository.save(new Task(
                "Print Attendee Badges and Delegate Folders",
                "Verify spelling of participant names, barcodes, and hand over to hospitality counter.",
                event1, team2, vol2, TaskPriority.MEDIUM, TaskStatus.PENDING, LocalDate.now().plusDays(3)
        ));

        taskRepository.save(new Task(
                "Coordinate Keynote Speaker Travel & Reception",
                "Confirm flight arrivals, arrange campus transit, and prepare executive guest suite.",
                event1, team2, vol3, TaskPriority.HIGH, TaskStatus.IN_PROGRESS, LocalDate.now().plusDays(2)
        ));

        taskRepository.save(new Task(
                "Publish Social Media Promo Video and Schedules",
                "Roll out teaser across campus channels, Instagram, and LinkedIn with official handles.",
                event1, team2, vol2, TaskPriority.MEDIUM, TaskStatus.COMPLETED, LocalDate.now().minusDays(2)
        ));

        taskRepository.save(new Task(
                "Prepare First-Aid Kits and Emergency Protocol",
                "Station first-aid boxes at registration and lab entrances; coordinate campus ambulance standby.",
                event2, team3, vol3, TaskPriority.HIGH, TaskStatus.PENDING, LocalDate.now().plusDays(1)
        ));

        // 6. Seed Resources
        Resource r1 = resourceRepository.save(new Resource(
                "High-Definition 4K Laser Projectors", "Audio/Visual", 10, 8, event1, "PARTIALLY_ALLOCATED", 1200.0
        ));

        Resource r2 = resourceRepository.save(new Resource(
                "Wireless Handheld & Collar Mics Set", "Audio/Visual", 25, 15, event1, "PARTIALLY_ALLOCATED", 350.0
        ));

        Resource r3 = resourceRepository.save(new Resource(
                "Workstation Laptops (i7 / 32GB RAM)", "Computing", 40, 35, event2, "PARTIALLY_ALLOCATED", 850.0
        ));

        Resource r4 = resourceRepository.save(new Resource(
                "Stage Line-Array Audio Console", "Audio/Visual", 4, 2, event3, "PARTIALLY_ALLOCATED", 4500.0
        ));

        Resource r5 = resourceRepository.save(new Resource(
                "Banquet Tables & Cushioned Chairs (Sets)", "Furniture", 150, 120, event1, "PARTIALLY_ALLOCATED", 65.0
        ));

        Resource r6 = resourceRepository.save(new Resource(
                "Main Auditorium Complex", "Facility", 1, 1, event1, "AVAILABLE", 20000.0
        ));

        // 7. Seed Resource Requests (Approvals)
        ResourceRequest req1 = new ResourceRequest(event1, r1, coord1, 2, "Required for keynote auditorium projection");
        req1.setStatus(ApprovalStatus.APPROVED);
        req1.setReviewedBy(admin);
        req1.setReviewedAt(LocalDateTime.now().minusDays(1));
        req1.setApproverComments("Approved for opening ceremony and paper tracks.");
        resourceRequestRepository.save(req1);

        ResourceRequest req2 = new ResourceRequest(event1, r2, coord1, 10, "Sound reinforcement for paper presentation rooms");
        req2.setStatus(ApprovalStatus.APPROVED);
        req2.setReviewedBy(admin);
        req2.setReviewedAt(LocalDateTime.now().minusDays(1));
        req2.setApproverComments("Microphone batch allocated.");
        resourceRequestRepository.save(req2);

        ResourceRequest req3 = new ResourceRequest(event2, r3, coord2, 5, "Mentor workstations for hackathon evaluation");
        req3.setStatus(ApprovalStatus.APPROVED);
        req3.setReviewedBy(admin);
        req3.setReviewedAt(LocalDateTime.now().minusDays(2));
        req3.setApproverComments("Assigned from Department Lab.");
        resourceRequestRepository.save(req3);

        ResourceRequest req4 = new ResourceRequest(event3, r4, coord1, 2, "Amphitheatre main concert audio array");
        req4.setStatus(ApprovalStatus.PENDING);
        resourceRequestRepository.save(req4);

        ResourceRequest req5 = new ResourceRequest(event1, r5, coord1, 30, "Registration desk and food distribution seating");
        req5.setStatus(ApprovalStatus.PENDING);
        resourceRequestRepository.save(req5);

        // 8. Seed Vendors
        vendorRepository.save(new Vendor(
                "AcousticVibe Audio & Lighting Systems",
                "Ramesh Patel",
                "9876543210",
                "ramesh@acousticvibe.com",
                "Sound & Stage",
                "Stage sound system, trussing and dynamic LED flood lights",
                42000.0,
                PaymentStatus.PARTIALLY_PAID,
                event1,
                "Advance 50% paid. Final settlement upon event teardown."
        ));

        vendorRepository.save(new Vendor(
                "Royal Feast Event Caterers",
                "Sunita Kapoor",
                "9876543211",
                "contact@royalfeast.com",
                "Catering",
                "Buffet lunch and continuous high-tea for 1200 participants",
                75000.0,
                PaymentStatus.PENDING,
                event1,
                "Menu approved by student committee. Delivery at 12:30 PM."
        ));

        vendorRepository.save(new Vendor(
                "PixelCraft Media & Live Stream",
                "Arjun Nair",
                "9876543212",
                "arjun@pixelcraft.io",
                "Photography",
                "4K Multi-camera livestreaming, dronework and aftermovie",
                28000.0,
                PaymentStatus.PAID,
                event2,
                "Full contract amount cleared. Raw footage delivered on drive."
        ));

        // 9. Seed Announcements
        announcementRepository.save(new Announcement(
                "Volunteer Briefing Meeting Tomorrow at 10:00 AM",
                "All team members and volunteers are required to attend the coordination briefing in Room 302.",
                "ALL", event1, admin
        ));

        announcementRepository.save(new Announcement(
                "Hackathon Mentor Checkpoints Scheduled",
                "Mentor rounds will begin promptly at 02:00 AM and 08:00 AM. Ensure team desks have evaluation sheets ready.",
                "VOLUNTEER", event2, coord1
        ));

        announcementRepository.save(new Announcement(
                "Resource Allocation Quota Notice",
                "All department equipment requests must be approved at least 48 hours prior to event commencement.",
                "COORDINATOR", null, admin
        ));

        // 10. Seed Audit Logs
        auditLogRepository.save(new AuditLog(admin.getId(), admin.getEmail(), "SYSTEM_INIT", "System", 1L, "EventOps system initialized with default seeds"));
        auditLogRepository.save(new AuditLog(admin.getId(), admin.getEmail(), "EVENT_CREATE", "Event", event1.getId(), "Created event: " + event1.getName()));
        auditLogRepository.save(new AuditLog(admin.getId(), admin.getEmail(), "EVENT_CREATE", "Event", event2.getId(), "Created event: " + event2.getName()));
        auditLogRepository.save(new AuditLog(coord1.getId(), coord1.getEmail(), "TEAM_CREATE", "Team", team1.getId(), "Created team: " + team1.getName()));
        auditLogRepository.save(new AuditLog(admin.getId(), admin.getEmail(), "RESOURCE_REQUEST_APPROVED", "ResourceRequest", req1.getId(), "Approved request for 2 High-Definition 4K Laser Projectors"));
        auditLogRepository.save(new AuditLog(vol1.getId(), vol1.getEmail(), "TASK_STATUS_UPDATE", "Task", 2L, "Status changed to COMPLETED"));
    }
}
