<?php
/**
 * Database Configuration
 * Wa Japanese Cuisine
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'wa_japanese_cuisine');
define('DB_CHARSET', 'utf8mb4');

// Create database connection
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]));
}

// Site Configuration
define('SITE_URL', 'http://localhost/Restaurant%20reservation');
define('SITE_NAME', 'Wa Japanese Cuisine');

// Cart Configuration
define('DISCOUNT_THRESHOLD', 5); // Number of people for discount
define('DISCOUNT_PERCENTAGE', 20); // Discount percentage
define('DELIVERY_FEE_THRESHOLD', 5); // km
define('TAX_RATE', 0.08); // 8% tax

// Helper Functions

/**
 * Get current user ID from session
 */
function getCurrentUserId() {
    return isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
}

/**
 * Get or create session ID for guest users
 */
function getSessionId() {
    if (!isset($_SESSION['session_id'])) {
        $_SESSION['session_id'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['session_id'];
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

/**
 * Sanitize input data
 */
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

/**
 * Format price in VND
 */
function formatPrice($price) {
    return number_format($price, 0, ',', '.') . ' ₫';
}

/**
 * Generate unique order number
 */
function generateOrderNumber() {
    return 'WA' . date('Ymd') . strtoupper(substr(uniqid(), -6));
}

/**
 * Calculate cart totals
 */
function calculateCartTotals($subtotal, $deliveryFee = 0, $discountRate = 0) {
    $discount = $subtotal * ($discountRate / 100);
    $tax = ($subtotal - $discount) * TAX_RATE;
    $total = $subtotal - $discount + $tax + $deliveryFee;
    
    return [
        'subtotal' => $subtotal,
        'discount' => $discount,
        'tax' => $tax,
        'delivery_fee' => $deliveryFee,
        'total' => $total
    ];
}

/**
 * Send JSON response
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
?>
