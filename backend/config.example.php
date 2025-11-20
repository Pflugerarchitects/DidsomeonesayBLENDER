<?php
/**
 * Configuration File - Example
 * Copy this to config.php and update with actual values
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'pflugera_projectprism_db');  // Shared with ProjectPrism
define('DB_USER', 'pflugera_prism_user');
define('DB_PASS', 'your_password_here');
define('DB_CHARSET', 'utf8mb4');

// CORS Configuration
// IMPORTANT: For local dev to work, CORS must allow localhost:5173
// Options:
// 1. Allow all (less secure, but simplest): define('ALLOWED_ORIGIN', '*');
// 2. Production only: define('ALLOWED_ORIGIN', 'https://vizzy.pflugerarchitects.com');
// 3. Multiple origins (requires updating utils.php to handle array)

// Recommended for development AND production:
define('ALLOWED_ORIGIN', '*');  // Allows both localhost:5173 and production domain

// File Upload Configuration
define('MAX_FILE_SIZE', 20 * 1024 * 1024);  // 20MB
define('ALLOWED_TYPES', [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
]);

// Upload Directory (relative to backend/)
define('UPLOAD_DIR', __DIR__ . '/../uploads/images/');

// Error Display (turn off in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);
