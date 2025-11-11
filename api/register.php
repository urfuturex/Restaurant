<?php
/**
 * Registration API
 * Handles user registration
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
$required = ['name', 'email', 'password'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        jsonResponse(['success' => false, 'message' => "Vui lòng nhập $field"], 400);
    }
}

$name = trim($input['name']);
$email = trim($input['email']);
$password = $input['password'];
$phone = isset($input['phone']) ? trim($input['phone']) : null;

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Email không hợp lệ'], 400);
}

// Validate password length
if (strlen($password) < 6) {
    jsonResponse(['success' => false, 'message' => 'Mật khẩu phải có ít nhất 6 ký tự'], 400);
}

try {
    global $pdo;
    
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT user_id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Email đã được sử dụng'], 400);
    }
    
    // Hash password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $stmt = $pdo->prepare("
        INSERT INTO users (full_name, email, password_hash, phone, created_at) 
        VALUES (?, ?, ?, ?, NOW())
    ");
    
    $stmt->execute([$name, $email, $password_hash, $phone]);
    $user_id = $pdo->lastInsertId();
    
    // Create session
    $_SESSION['user_id'] = $user_id;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    
    jsonResponse([
        'success' => true,
        'message' => 'Đăng ký thành công!',
        'user' => [
            'id' => $user_id,
            'name' => $name,
            'email' => $email
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Registration error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Lỗi hệ thống. Vui lòng thử lại sau.'], 500);
}
?>
