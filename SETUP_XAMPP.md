# HƯỚNG DẪN CÀI ĐẶT DATABASE VỚI XAMPP

## Bước 1: Khởi động XAMPP

1. Mở **XAMPP Control Panel**
2. Start **Apache** (cho PHP)
3. Start **MySQL** (cho Database)

## Bước 2: Tạo Database

### Cách 1: Sử dụng phpMyAdmin (Giao diện đồ họa)

1. Mở trình duyệt và vào: `http://localhost/phpmyadmin`
2. Click tab **"Databases"** ở trên cùng
3. Trong mục **"Create database"**:
   - Nhập tên database: `wa_japanese_cuisine`
   - Chọn Collation: `utf8mb4_unicode_ci`
   - Click **"Create"**

4. Sau khi database được tạo, click vào tên database `wa_japanese_cuisine` ở bên trái
5. Click tab **"Import"** ở trên
6. Click **"Choose File"** và chọn file:
   ```
   /Users/naotod/Downloads/Restaurant reservation/database/schema.sql
   ```
7. Click **"Go"** ở cuối trang để import

✅ **Xong!** Database đã được tạo với tất cả các bảng và dữ liệu mẫu.

### Cách 2: Sử dụng Terminal (Nhanh hơn)

```bash
# Mở Terminal và chạy các lệnh sau:

# 1. Tạo database
/Applications/XAMPP/xamppfiles/bin/mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS wa_japanese_cuisine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Import schema (nhập đường dẫn đầy đủ)
/Applications/XAMPP/xamppfiles/bin/mysql -u root -p wa_japanese_cuisine < "/Users/naotod/Downloads/Restaurant reservation/database/schema.sql"

# Lưu ý: Nếu MySQL yêu cầu password, nhấn Enter (mặc định không có password)
```

## Bước 3: Di chuyển Project vào htdocs

1. Copy toàn bộ folder `Restaurant reservation` vào:
   ```
   /Applications/XAMPP/xamppfiles/htdocs/
   ```

2. Sau khi copy, đường dẫn sẽ là:
   ```
   /Applications/XAMPP/xamppfiles/htdocs/Restaurant reservation/
   ```

## Bước 4: Kiểm tra kết nối Database

1. Mở trình duyệt và vào:
   ```
   http://localhost/Restaurant%20reservation/test-db.php
   ```

2. Nếu thấy:
   - ✅ **"Database connected successfully!"** → Thành công!
   - ❌ **Lỗi** → Kiểm tra lại các bước trên

## Bước 5: Cập nhật file để dùng API thật

### Cập nhật menu.html:
```html
<!-- Đổi từ: -->
<script src="js/cart-mock.js"></script>

<!-- Thành: -->
<script src="js/cart.js"></script>
```

### Cập nhật cart.html:
```html
<!-- Đổi từ: -->
<script src="js/cart-mock.js"></script>

<!-- Thành: -->
<script src="js/cart.js"></script>
```

## Bước 6: Test chức năng giỏ hàng

1. Mở: `http://localhost/Restaurant%20reservation/menu.html`
2. Click vào một món ăn
3. Chọn số lượng và click **"THÊM VÀO GIỎ"**
4. Click icon giỏ hàng → Xem món đã thêm
5. Test tăng/giảm số lượng, xóa món

## Cấu trúc Database

```
wa_japanese_cuisine
├── users (Người dùng)
├── categories (Danh mục món ăn)
├── menu_items (Món ăn) - 12 món mẫu
├── cart_items (Giỏ hàng)
├── orders (Đơn hàng)
├── order_items (Chi tiết đơn hàng)
└── reservations (Đặt bàn)
```

## Dữ liệu mẫu có sẵn

### Categories:
- Tất cả
- Sushi
- Sashimi
- Ramen
- Tempura
- Đồ uống

### Menu Items (12 món):
1. Salmon Sushi - 120,000đ
2. Tuna Sushi - 150,000đ
3. Ebi Sushi - 100,000đ
4. Salmon Sashimi - 180,000đ
5. Mixed Sashimi - 250,000đ
6. Tonkotsu Ramen - 85,000đ
7. Miso Ramen - 80,000đ
8. Shoyu Ramen - 75,000đ
9. Ebi Tempura - 95,000đ
10. Vegetable Tempura - 65,000đ
11. Green Tea - 30,000đ
12. Sake - 120,000đ

## Xem dữ liệu trong phpMyAdmin

1. Vào: `http://localhost/phpmyadmin`
2. Click database `wa_japanese_cuisine` ở bên trái
3. Click vào từng bảng để xem dữ liệu:
   - **menu_items** - Xem danh sách món ăn
   - **cart_items** - Xem giỏ hàng người dùng
   - **orders** - Xem lịch sử đơn hàng

## Troubleshooting

### Lỗi: "Access denied for user 'root'@'localhost'"
**Giải pháp:**
1. Vào phpMyAdmin
2. Click "User accounts"
3. Kiểm tra password của user `root`
4. Nếu có password, cập nhật file `php/config.php`:
```php
define('DB_PASS', 'your_password_here');
```

### Lỗi: "Unknown database 'wa_japanese_cuisine'"
**Giải pháp:**
- Database chưa được tạo. Làm lại Bước 2.

### Lỗi: "Table doesn't exist"
**Giải pháp:**
- Schema chưa được import. Import lại file `database/schema.sql`.

### Lỗi: API không hoạt động
**Giải pháp:**
1. Kiểm tra Apache đã start trong XAMPP
2. Kiểm tra project đã được copy vào htdocs
3. Kiểm tra URL: `http://localhost/Restaurant%20reservation/api/cart.php?action=count`
   - Phải trả về JSON: `{"success":true,"count":0}`

## Các file quan trọng

- `php/config.php` - Cấu hình database
- `api/cart.php` - API xử lý giỏ hàng
- `database/schema.sql` - Cấu trúc database
- `js/cart.js` - JavaScript xử lý giỏ hàng (dùng API)
- `js/cart-mock.js` - JavaScript test không cần database (dùng localStorage)

## Lưu ý quan trọng

⚠️ **Để dùng database thật:**
- Phải có XAMPP đang chạy (Apache + MySQL)
- Project phải nằm trong folder `htdocs`
- Truy cập qua `http://localhost/...` (không phải `file:///...`)

✅ **Để test nhanh không cần database:**
- Dùng `cart-mock.js` (localStorage)
- Có thể mở file HTML trực tiếp
- Dữ liệu lưu trong trình duyệt, mất khi clear cache
