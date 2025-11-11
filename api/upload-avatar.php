<?php
/**
 * Upload Avatar API
 * Handles user avatar upload
 */

require_once '../php/config.php';

header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Check if file was uploaded
if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['success' => false, 'message' => 'Vui lòng chọn ảnh'], 400);
}

// Get user_id
$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
if (!$user_id) {
    jsonResponse(['success' => false, 'message' => 'User ID is required'], 400);
}

$file = $_FILES['avatar'];
$file_name = $file['name'];
$file_tmp = $file['tmp_name'];
$file_size = $file['size'];
$file_type = $file['type'];

// Validate file type
$allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($file_type, $allowed_types)) {
    jsonResponse(['success' => false, 'message' => 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)'], 400);
}

// Validate file size (max 5MB)
if ($file_size > 5 * 1024 * 1024) {
    jsonResponse(['success' => false, 'message' => 'Kích thước ảnh phải nhỏ hơn 5MB'], 400);
}

try {
    global $pdo;
    
    // Check if user exists
    $checkStmt = $pdo->prepare("SELECT user_id FROM users WHERE user_id = ?");
    $checkStmt->execute([$user_id]);
    if (!$checkStmt->fetch()) {
        jsonResponse(['success' => false, 'message' => 'User not found'], 404);
    }
    
    // Create uploads directory if not exists
    $upload_dir = '../uploads/avatars/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    // Generate unique filename
    $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $new_filename = 'avatar_' . $user_id . '_' . time() . '.' . $file_extension;
    $upload_path = $upload_dir . $new_filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file_tmp, $upload_path)) {
        jsonResponse(['success' => false, 'message' => 'Lỗi khi lưu ảnh'], 500);
    }
    
    // Resize image (optional - keep original for now)
    // You can add image resize logic here if needed
    
    // Get relative URL
    $avatar_url = 'uploads/avatars/' . $new_filename;
    
    // Update database (add avatar column if not exists)
    // First, check if avatar column exists
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL");
    } catch (PDOException $e) {
        // Column probably already exists, ignore error
    }
    
    // Update user's avatar
    $updateStmt = $pdo->prepare("
        UPDATE users 
        SET avatar = ?,
            updated_at = NOW()
        WHERE user_id = ?
    ");
    $updateStmt->execute([$avatar_url, $user_id]);
    
    jsonResponse([
        'success' => true,
        'message' => 'Upload ảnh đại diện thành công',
        'avatar_url' => $avatar_url
    ]);
    
} catch (PDOException $e) {
    error_log("Upload avatar error: " . $e->getMessage());
    jsonResponse(['success' => false, 'message' => 'Lỗi hệ thống'], 500);
}
?>
