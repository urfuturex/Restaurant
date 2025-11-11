<?php
/**
 * Get User Profile API
 */

require_once '../php/config.php';

header('Content-Type: application/json');

// Get user_id from query string
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if (!$user_id) {
    jsonResponse(['success' => false, 'message' => 'User ID is required'], 400);
}

try {
    global $pdo;
    
    $stmt = $pdo->prepare("
        SELECT 
            user_id,
            full_name,
            email,
            phone,
            address,
            avatar,
            created_at,
            is_active
        FROM users
        WHERE user_id = ?
    ");
    
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    
    if ($user) {
        jsonResponse([
            'success' => true,
            'user' => [
                'id' => $user['user_id'],
                'full_name' => $user['full_name'],
                'name' => $user['full_name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'address' => $user['address'],
                'avatar' => $user['avatar'],
                'created_at' => $user['created_at'],
                'is_active' => $user['is_active']
            ]
        ]);
    } else {
        jsonResponse(['success' => false, 'message' => 'User not found'], 404);
    }
    
} catch (PDOException $e) {
    error_log("Get profile error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Lỗi hệ thống'], 500);
}
?>
