<?php
/**
 * Test Database Connection
 * File này dùng để kiểm tra kết nối database
 */

// Display all errors
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Kiểm tra kết nối Database</h1>";

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'wa_japanese_cuisine');
define('DB_CHARSET', 'utf8mb4');

try {
    // Test connection
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    
    echo "<p style='color: green; font-weight: bold;'>✅ Kết nối database thành công!</p>";
    echo "<hr>";
    
    // Test get tables
    echo "<h2>Danh sách các bảng trong database:</h2>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (count($tables) > 0) {
        echo "<ul>";
        foreach ($tables as $table) {
            echo "<li><strong>$table</strong>";
            
            // Count rows in each table
            $countStmt = $pdo->query("SELECT COUNT(*) as total FROM $table");
            $count = $countStmt->fetch()['total'];
            echo " - <em>$count bản ghi</em>";
            echo "</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: orange;'>⚠️ Database rỗng. Hãy import file schema.sql</p>";
    }
    
    echo "<hr>";
    
    // Test get menu items
    echo "<h2>Danh sách món ăn (menu_items):</h2>";
    $menuStmt = $pdo->query("SELECT item_id, item_name, price, is_available FROM menu_items LIMIT 10");
    $menuItems = $menuStmt->fetchAll();
    
    if (count($menuItems) > 0) {
        echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
        echo "<tr style='background: #f0f0f0;'>
                <th>ID</th>
                <th>Tên món</th>
                <th>Giá</th>
                <th>Trạng thái</th>
              </tr>";
        
        foreach ($menuItems as $item) {
            $status = $item['is_available'] ? '✅ Có sẵn' : '❌ Hết';
            $price = number_format($item['price'], 0, ',', '.') . ' đ';
            echo "<tr>
                    <td>{$item['item_id']}</td>
                    <td>{$item['item_name']}</td>
                    <td>$price</td>
                    <td>$status</td>
                  </tr>";
        }
        echo "</table>";
    } else {
        echo "<p style='color: orange;'>⚠️ Chưa có món ăn. Hãy import dữ liệu mẫu từ schema.sql</p>";
    }
    
    echo "<hr>";
    echo "<h2>✅ Kết luận:</h2>";
    echo "<p><strong>Database đã sẵn sàng sử dụng!</strong></p>";
    echo "<p>Bạn có thể:</p>";
    echo "<ul>";
    echo "<li><a href='menu.html'>Xem trang menu</a></li>";
    echo "<li><a href='cart.html'>Xem giỏ hàng</a></li>";
    echo "<li><a href='http://localhost/phpmyadmin' target='_blank'>Quản lý database qua phpMyAdmin</a></li>";
    echo "</ul>";
    
} catch (PDOException $e) {
    echo "<p style='color: red; font-weight: bold;'>❌ Lỗi kết nối database:</p>";
    echo "<pre style='background: #ffeeee; padding: 15px; border-radius: 5px;'>";
    echo $e->getMessage();
    echo "</pre>";
    
    echo "<hr>";
    echo "<h3>Hướng dẫn khắc phục:</h3>";
    echo "<ol>";
    echo "<li><strong>Kiểm tra XAMPP:</strong>
            <ul>
                <li>Mở XAMPP Control Panel</li>
                <li>Start Apache</li>
                <li>Start MySQL</li>
            </ul>
          </li>";
    echo "<li><strong>Tạo database:</strong>
            <ul>
                <li>Vào <a href='http://localhost/phpmyadmin' target='_blank'>phpMyAdmin</a></li>
                <li>Tạo database mới tên: <code>wa_japanese_cuisine</code></li>
                <li>Import file: <code>database/schema.sql</code></li>
            </ul>
          </li>";
    echo "<li><strong>Kiểm tra thông tin đăng nhập:</strong>
            <ul>
                <li>Username: <code>root</code></li>
                <li>Password: <code>(để trống)</code></li>
                <li>Nếu có password, cập nhật trong file <code>php/config.php</code></li>
            </ul>
          </li>";
    echo "</ol>";
}
?>

<style>
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
    h2 {
        color: #555;
        margin-top: 20px;
    }
    table {
        width: 100%;
        margin: 20px 0;
        background: white;
    }
    pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    code {
        background: #eee;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
    }
    a {
        color: #2196F3;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>
