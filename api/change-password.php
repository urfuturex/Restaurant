<?php
/**
 * Change Password API
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
if (empty($input['user_id']) || empty($input['current_password']) || empty($input['new_password'])) {
    jsonResponse(['success' => false, 'message' => 'Vui lòng điền đầy đủ thông tin'], 400);
}

$user_id = intval($input['user_id']);
$current_password = $input['current_password'];
$new_password = $input['new_password'];

// Validate new password length
if (strlen($new_password) < 6) {
    jsonResponse(['success' => false, 'message' => 'Mật khẩu mới phải có ít nhất 6 ký tự'], 400);
}

try {
    global $pdo;
    
    // Get user's current password hash
    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    
    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'User not found'], 404);
    }
    
    // Verify current password
    if (!password_verify($current_password, $user['password_hash'])) {
        jsonResponse(['success' => false, 'message' => 'Mật khẩu hiện tại không đúng'], 401);
    }
    
    // Hash new password
    $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);
    
    // Update password
    $updateStmt = $pdo->prepare("
        UPDATE users 
        SET password_hash = ?,
            updated_at = NOW()
        WHERE user_id = ?
    ");
    
    $updateStmt->execute([$new_password_hash, $user_id]);
    
    jsonResponse([
        'success' => true,
        'message' => 'Đổi mật khẩu thành công'
    ]);
    
} catch (PDOException $e) {
    error_log("Change password error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Lỗi hệ thống. Vui lòng thử lại.'], 500);
}
?>
