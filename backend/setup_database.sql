-- ==============================================================
-- EventOps - MySQL Database Setup Script
-- ==============================================================

-- 1. Create Database if it does not exist
CREATE DATABASE IF NOT EXISTS `eventops` 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE `eventops`;

-- 2. Verify Database Selection
SELECT DATABASE() AS CurrentDatabase;

-- Note:
-- Spring Boot Data JPA with `spring.jpa.hibernate.ddl-auto=update`
-- automatically generates and updates all required tables upon starting.
--
-- Seed accounts automatically populated on first startup by DataInitializer:
-- - Admin:       Aarav Sharma     - admin@eventops.com       (Password: admin123)
-- - Coordinator: Sneha Reddy      - coordinator@eventops.com (Password: coord123)
-- - Team Lead:   Rohan Gupta      - teamlead@eventops.com    (Password: lead123)
-- - Volunteer:   Karthik Raman    - volunteer@eventops.com   (Password: vol123)

