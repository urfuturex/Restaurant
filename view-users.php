<?php
/**
 * View Users in Database
 * Admin page to view registered users
 */

// Display all errors
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'php/config.php';

echo "<html><head>";
echo "<title>Danh sách người dùng - Wa Japanese Cuisine</title>";
echo "<style>
    body {
        font-family: Arial, sans-serif;
        max-width: 1200px;
        margin: 40px auto;
        padding: 20px;
        background: #f5f5f5;
    }
    h1 {
        color: #333;
        border-bottom: 3px solid #4CAF50;
        padding-bottom: 10px;
    }
    table {
        width: 100%;
        margin: 20px 0;
        background: white;
        border-collapse: collapse;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    th {
        background: #4CAF50;
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: bold;
    }
    td {
        padding: 12px;
        border-bottom: 1px solid #ddd;
    }
    tr:hover {
        background: #f9f9f9;
    }
    .status-active {
        color: #4CAF50;
        font-weight: bold;
    }
    .status-inactive {
        color: #f44336;
        font-weight: bold;
    }
    .actions {
        display: flex;
        gap: 10px;
    }
    .btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-decoration: none;
        font-size: 14px;
    }
    .btn-primary {
        background: #2196F3;
        color: white;
    }
    .btn-danger {
        background: #f44336;
        color: white;
    }
    .empty {
        text-align: center;
        padding: 40px;
        color: #999;
        font-size: 18px;
    }
    .stats {
        display: flex;
        gap: 20px;
        margin: 20px 0;
    }
    .stat-card {
        flex: 1;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .stat-number {
        font-size: 32px;
        font-weight: bold;
        color: #4CAF50;
    }
    .stat-label {
        color: #666;
        margin-top: 5px;
    }
    .nav-links {
        margin: 20px 0;
        display: flex;
        gap: 15px;
    }
    .nav-links a {
        padding: 10px 20px;
        background: #2196F3;
        color: white;
        text-decoration: none;
        border-radius: 5px;
    }
    .nav-links a:hover {
        background: #1976D2;
    }
</style>
</head><body>";

echo "<h1>👥 Danh sách người dùng đã đăng ký</h1>";

echo "<div class='nav-links'>
    <a href='test-db.php'>← Kiểm tra Database</a>
    <a href='menu.html'>Trang Menu</a>
    <a href='http://localhost/phpmyadmin' target='_blank'>phpMyAdmin</a>
</div>";

try {
    global $pdo;
    
    // Get statistics
    $totalUsers = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $activeUsers = $pdo->query("SELECT COUNT(*) FROM users WHERE is_active = 1")->fetchColumn();
    $todayUsers = $pdo->query("SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()")->fetchColumn();
    
    echo "<div class='stats'>
        <div class='stat-card'>
            <div class='stat-number'>$totalUsers</div>
            <div class='stat-label'>Tổng người dùng</div>
        </div>
        <div class='stat-card'>
            <div class='stat-number'>$activeUsers</div>
            <div class='stat-label'>Đang hoạt động</div>
        </div>
        <div class='stat-card'>
            <div class='stat-number'>$todayUsers</div>
            <div class='stat-label'>Đăng ký hôm nay</div>
        </div>
    </div>";
    
    // Get all users
    $stmt = $pdo->query("
        SELECT 
            user_id,
            full_name,
            email,
            phone,
            is_active,
            created_at
        FROM users
        ORDER BY created_at DESC
    ");
    
    $users = $stmt->fetchAll();
    
    if (count($users) > 0) {
        echo "<table>";
        echo "<thead>
            <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Ngày đăng ký</th>
            </tr>
        </thead>";
        echo "<tbody>";
        
        foreach ($users as $user) {
            $status = $user['is_active'] 
                ? "<span class='status-active'>✓ Hoạt động</span>" 
                : "<span class='status-inactive'>✗ Khóa</span>";
            
            $phone = $user['phone'] ?: '<em style="color: #999;">Chưa cập nhật</em>';
            $created = date('d/m/Y H:i', strtotime($user['created_at']));
            
            echo "<tr>
                <td>#{$user['user_id']}</td>
                <td><strong>{$user['full_name']}</strong></td>
                <td>{$user['email']}</td>
                <td>$phone</td>
                <td>$status</td>
                <td>$created</td>
            </tr>";
        }
        
        echo "</tbody>";
        echo "</table>";
        
        echo "<p style='margin-top: 20px; color: #666;'>
            <strong>Lưu ý:</strong> Mật khẩu được mã hóa bằng password_hash() và không thể xem được.
        </p>";
        
    } else {
        echo "<div class='empty'>
            <h2>📭 Chưa có người dùng nào đăng ký</h2>
            <p>Hãy thử đăng ký tài khoản mới tại:</p>
            <a href='signup.html' class='btn btn-primary' style='display: inline-block; margin-top: 10px;'>
                Đăng ký ngay
            </a>
        </div>";
    }
    
} catch (PDOException $e) {
    echo "<div style='background: #ffeeee; padding: 20px; border-radius: 8px; color: #d32f2f;'>";
    echo "<h2>❌ Lỗi kết nối database</h2>";
    echo "<pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
    echo "<p>Vui lòng kiểm tra:</p>";
    echo "<ol>
        <li>XAMPP đã chạy MySQL chưa?</li>
        <li>Database 'wa_japanese_cuisine' đã được tạo chưa?</li>
        <li>Bảng 'users' đã được import chưa?</li>
    </ol>";
    echo "</div>";
}

echo "</body></html>";
?>
