<?php
/**
 * Update User Profile API
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
if (empty($input['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'User ID is required'], 400);
}

$user_id = intval($input['user_id']);
$full_name = isset($input['full_name']) ? trim($input['full_name']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : null;
$address = isset($input['address']) ? trim($input['address']) : null;
$note = isset($input['note']) ? trim($input['note']) : null;

// Validate full name
if (empty($full_name)) {
    jsonResponse(['success' => false, 'message' => 'Vui lòng nhập họ tên'], 400);
}

try {
    global $pdo;
    
    // Check if user exists
    $checkStmt = $pdo->prepare("SELECT user_id FROM users WHERE user_id = ?");
    $checkStmt->execute([$user_id]);
    
    if (!$checkStmt->fetch()) {
        jsonResponse(['success' => false, 'message' => 'User not found'], 404);
    }
    
    // Update user profile
    $stmt = $pdo->prepare("
        UPDATE users 
        SET full_name = ?,
            phone = ?,
            address = ?,
            updated_at = NOW()
        WHERE user_id = ?
    ");
    
    $stmt->execute([$full_name, $phone, $address, $user_id]);
    
    // Get updated user data
    $getUserStmt = $pdo->prepare("
        SELECT user_id, full_name, email, phone, address 
        FROM users 
        WHERE user_id = ?
    ");
    $getUserStmt->execute([$user_id]);
    $user = $getUserStmt->fetch();
    
    jsonResponse([
        'success' => true,
        'message' => 'Cập nhật thông tin thành công',
        'user' => [
            'id' => $user['user_id'],
            'name' => $user['full_name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'address' => $user['address']
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Update profile error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Lỗi hệ thống. Vui lòng thử lại.'], 500);
}
?>
