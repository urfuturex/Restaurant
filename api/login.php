<?php
/**
 * Login API
 * Handles user authentication
 */

require_once '../php/config.php';

header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (empty($input['email']) || empty($input['password'])) {
    jsonResponse(['success' => false, 'message' => 'Vui lòng nhập email và mật khẩu'], 400);
}

$email = trim($input['email']);
$password = $input['password'];

try {
    global $pdo;
    
    // Get user by email
    $stmt = $pdo->prepare("
        SELECT user_id, full_name, email, password_hash, is_active 
        FROM users 
        WHERE email = ?
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    // Check if user exists
    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'Email hoặc mật khẩu không đúng'], 401);
    }
    
    // Check if account is active
    if (!$user['is_active']) {
        jsonResponse(['success' => false, 'message' => 'Tài khoản đã bị khóa'], 403);
    }
    
    // Verify password
    if (!password_verify($password, $user['password_hash'])) {
        jsonResponse(['success' => false, 'message' => 'Email hoặc mật khẩu không đúng'], 401);
    }
    
    // Create session
    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['user_email'] = $user['email'];
    
    // Update last login (optional)
    $updateStmt = $pdo->prepare("UPDATE users SET updated_at = NOW() WHERE user_id = ?");
    $updateStmt->execute([$user['user_id']]);
    
    jsonResponse([
        'success' => true,
        'message' => 'Đăng nhập thành công!',
        'user' => [
            'id' => $user['user_id'],
            'name' => $user['full_name'],
            'email' => $user['email']
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Lỗi hệ thống. Vui lòng thử lại sau.'], 500);
}
?>
