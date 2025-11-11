# 🚀 HƯỚNG DẪN NHANH - SETUP XAMPP CHO WA JAPANESE CUISINE

## ⚡ Cách 1: Tự động (Khuyên dùng - Nhanh nhất)

### Bước 1: Khởi động XAMPP
1. Mở **XAMPP Control Panel**
2. Click **Start** cho **Apache**
3. Click **Start** cho **MySQL**

### Bước 2: Chạy script tự động
```bash
cd "/Users/naotod/Downloads/Restaurant reservation"
chmod +x setup-database.sh
./setup-database.sh
```

✅ **Xong!** Script sẽ tự động:
- Tạo database `wa_japanese_cuisine`
- Import tất cả bảng và dữ liệu mẫu (9 món ăn)
- Hiển thị kết quả

---

## 📝 Cách 2: Thủ công qua phpMyAdmin

### Bước 1: Khởi động XAMPP
- Start **Apache** và **MySQL** trong XAMPP Control Panel

### Bước 2: Tạo database
1. Mở trình duyệt → `http://localhost/phpmyadmin`
2. Click tab **"Databases"**
3. Nhập tên: `wa_japanese_cuisine`
4. Chọn Collation: `utf8mb4_unicode_ci`
5. Click **"Create"**

### Bước 3: Import dữ liệu
1. Click vào database `wa_japanese_cuisine` ở bên trái
2. Click tab **"Import"**
3. Click **"Choose File"** → Chọn file:
   ```
   database/schema.sql
   ```
4. Click **"Go"**

✅ **Hoàn tất!**

---

## 📁 Bước 3: Di chuyển project vào htdocs

```bash
# Copy project vào htdocs
cp -r "/Users/naotod/Downloads/Restaurant reservation" /Applications/XAMPP/xamppfiles/htdocs/
```

Hoặc **kéo thả** folder `Restaurant reservation` vào:
```
/Applications/XAMPP/xamppfiles/htdocs/
```

---

## ✅ Bước 4: Kiểm tra

### 1. Test kết nối database
```
http://localhost/Restaurant%20reservation/test-db.php
```
- Xem danh sách 7 bảng
- Xem 9 món ăn mẫu
- Kiểm tra kết nối

### 2. Xem trang menu
```
http://localhost/Restaurant%20reservation/menu.html
```

### 3. Test giỏ hàng
1. Click vào món ăn (có ID từ 1-7)
2. Click **"THÊM VÀO GIỎ"**
3. Click icon giỏ hàng → Xem món đã thêm
4. Test tăng/giảm số lượng, xóa món

---

## 🎯 Dữ liệu có sẵn trong database

### 7 Bảng:
- ✅ `users` - Người dùng
- ✅ `categories` - Danh mục (6 loại)
- ✅ `menu_items` - Món ăn (9 món)
- ✅ `cart_items` - Giỏ hàng
- ✅ `orders` - Đơn hàng
- ✅ `order_items` - Chi tiết đơn hàng
- ✅ `reservations` - Đặt bàn

### 9 Món ăn mẫu:
| ID | Tên món | Giá |
|----|---------|-----|
| 1  | Súp cá Hamo và nấm tuyết tùng | 295,000đ |
| 2  | Cá hồi Phù Si bọc gỗ Tuyết tráng nướng | 320,000đ |
| 3  | Cá hồi Phù Si hấp Kabuka | 280,000đ |
| 4  | Thịt heo tuyết nướng | 585,000đ |
| 5  | Chân cua King Crab nướng xốt uni | 980,000đ |
| 6  | Chân cua King Crab nướng | 465,000đ |
| 7  | Chân cua King Crab phủ thạch mỹ vị | 990,000đ |
| 8  | Bào ngư phủ uni nướng Iseche | 450,000đ |
| 9  | Bào ngư uni cúp Wagyu | 850,000đ |

---

## 🔧 Cấu hình Database

File: `php/config.php`
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // Mặc định XAMPP không có password
define('DB_NAME', 'wa_japanese_cuisine');
```

⚠️ **Nếu MySQL có password**, sửa dòng `DB_PASS`.

---

## 🌐 Chế độ hoạt động

### 🔴 Mock Mode (Test nhanh - không cần database)
File sử dụng: `js/cart-mock.js`
- Lưu giỏ hàng trong **localStorage**
- Không cần XAMPP chạy
- Có thể mở file HTML trực tiếp

**Để bật Mock Mode:**
```html
<!-- menu.html và cart.html -->
<script src="js/cart-mock.js"></script>
<!-- <script src="js/cart.js"></script> -->
```

### 🟢 API Mode (Production - dùng database thật)
File sử dụng: `js/cart.js`
- Lưu giỏ hàng trong **MySQL database**
- Cần XAMPP chạy (Apache + MySQL)
- Truy cập qua `http://localhost/...`

**Để bật API Mode:** (Đang bật sẵn)
```html
<!-- menu.html và cart.html -->
<!-- <script src="js/cart-mock.js"></script> -->
<script src="js/cart.js"></script>
```

---

## 📂 Các file quan trọng

```
Restaurant reservation/
├── database/
│   └── schema.sql          ← Database schema + sample data
├── php/
│   └── config.php          ← Database connection
├── api/
│   └── cart.php            ← Cart API (get, add, update, remove)
├── js/
│   ├── cart.js             ← Cart với database (API mode)
│   └── cart-mock.js        ← Cart với localStorage (Mock mode)
├── test-db.php             ← Test kết nối database
├── setup-database.sh       ← Script tự động setup
└── SETUP_XAMPP.md          ← Hướng dẫn chi tiết
```

---

## 🐛 Xử lý lỗi thường gặp

### ❌ "Access denied for user 'root'"
**Giải pháp:** MySQL có password
```php
// Sửa trong php/config.php
define('DB_PASS', 'your_password');
```

### ❌ "Unknown database"
**Giải pháp:** Database chưa được tạo
- Làm lại Bước 2 (Tạo database)

### ❌ "Table doesn't exist"
**Giải pháp:** Schema chưa được import
- Import file `database/schema.sql`

### ❌ API không hoạt động
**Giải pháp:**
1. ✅ Apache đã start?
2. ✅ Project trong folder `htdocs`?
3. ✅ Truy cập qua `http://localhost/...`?
4. ✅ Test: `http://localhost/Restaurant%20reservation/api/cart.php?action=count`

---

## 🎉 Hoàn tất!

Giờ bạn có thể:
- ✅ Thêm món vào giỏ hàng
- ✅ Xem giỏ hàng với dữ liệu thật từ database
- ✅ Tăng/giảm số lượng món
- ✅ Xóa món khỏi giỏ
- ✅ Badge hiển thị số lượng món

**Test ngay:** `http://localhost/Restaurant%20reservation/menu.html`

---

## 📞 Debug

Nếu cần xem lỗi chi tiết, mở **Browser Console** (F12) và xem tab **Console** và **Network**.

Chúc bạn thành công! 🚀
