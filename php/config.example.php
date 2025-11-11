<?php
/**
 * Database Configuration Example
 * 
 * Copy this file to config.php and update with your database credentials
 * DO NOT commit config.php to GitHub (it's in .gitignore)
 */

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'wa_japanese_cuisine'); // Tên database của bạn
define('DB_USER', 'root');                // Username MySQL
define('DB_PASS', '');                    // Password MySQL (để trống nếu dùng XAMPP mặc định)
define('DB_CHARSET', 'utf8mb4');

// PDO connection
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    die(json_encode([
        'success' => false,
        'message' => 'Kết nối database thất bại: ' . $e->getMessage()
    ]));
}
?>
