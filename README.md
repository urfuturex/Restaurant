# 🍱 WA Japanese Cuisine - Restaurant Reservation System

Hệ thống đặt bàn và quản lý nhà hàng Nhật Bản với giao diện hiện đại, tích hợp giỏ hàng, thanh toán và quản lý tài khoản người dùng.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PHP](https://img.shields.io/badge/PHP-7.4+-purple.svg)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-orange.svg)

## ✨ Tính năng

### 🎨 Giao diện
- ✅ Trang chủ với slider và giới thiệu nhà hàng
- ✅ Menu món ăn với hình ảnh và giá
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Hiệu ứng animation mượt mà

### 🛒 Giỏ hàng
- ✅ Thêm/xóa/cập nhật số lượng món
- ✅ Tính tổng tiền tự động
- ✅ Lưu giỏ hàng vào localStorage
- ✅ Badge hiển thị số lượng món

### � Quản lý tài khoản
- ✅ Đăng ký/Đăng nhập với mã hóa password
- ✅ Trang profile với tabs (Thông tin, Lịch sử, Ưu đãi)
- ✅ Cập nhật thông tin cá nhân
- ✅ Đổi mật khẩu
- ✅ **Upload ảnh đại diện với preview ngay lập tức**
- ✅ Đăng xuất

### 🎯 Tính năng mới nhất
- 📸 **Avatar Upload**: Upload ảnh profile, preview ngay, lưu vào database
- 🔒 **Session Management**: Quản lý phiên đăng nhập an toàn
- 💾 **LocalStorage Sync**: Đồng bộ dữ liệu user giữa các trang

## 🚀 Cài đặt

### Yêu cầu hệ thống
- PHP 7.4 trở lên
- MySQL 5.7 trở lên
- Apache Server (XAMPP, WAMP, MAMP)
- Web browser hiện đại (Chrome, Firefox, Safari)

### Bước 1: Clone repository
```bash
git clone https://github.com/YOUR_USERNAME/restaurant-reservation.git
cd restaurant-reservation
```

### Bước 2: Cấu hình Database

1. **Tạo database trong phpMyAdmin:**
   - Truy cập: http://localhost/phpmyadmin
   - Tạo database tên: `wa_japanese_cuisine`
   - Chọn Collation: `utf8mb4_unicode_ci`

2. **Import schema:**
   ```bash
   # Trong phpMyAdmin, chọn database vừa tạo
   # Click tab "Import" → Chọn file database/schema.sql → Click "Go"
   ```
   
   Hoặc dùng command line:
   ```bash
   mysql -u root -p wa_japanese_cuisine < database/schema.sql
   ```

3. **Cấu hình kết nối:**
   ```bash
   # Copy file config mẫu
   cp php/config.example.php php/config.php
   
   # Sửa file php/config.php với thông tin database của bạn
   ```

### Bước 3: Cấu hình thư mục uploads

```bash
# Tạo thư mục và set quyền
mkdir -p uploads/avatars
chmod 777 uploads/avatars
```

### Bước 4: Chạy ứng dụng

1. **Với XAMPP:**
   ```bash
   # Copy toàn bộ project vào htdocs
   cp -r . /Applications/XAMPP/xamppfiles/htdocs/restaurant-reservation
   
   # Truy cập: http://localhost/restaurant-reservation/home.html
   ```

2. **Với PHP Built-in Server:**
   ```bash
   php -S localhost:8000
   # Truy cập: http://localhost:8000/home.html
   ```

Mở file `menu.html` và thêm `data-item-id` cho mỗi menu card:

```html
<article class="menu-card" data-category="appetizer" data-item-id="1">
  <img src="assets/menu/menu1.jpg" alt="Món 1" />
  <div class="card-body">
    <div class="price">295.000 đ</div>
    <h3 class="title">Súp cá Hamo và nấm tuyết tùng</h3>
    <hr class="card-line">
  </div>
</article>
```

**Danh sách Item IDs trong database:**
- ID 1: Salmon Sushi - 120,000đ
- ID 2: Tuna Sushi - 150,000đ
- ID 3: Ebi Sushi - 100,000đ
- ID 4: Salmon Sashimi - 180,000đ
- ID 5: Mixed Sashimi - 250,000đ
- ID 6: Tonkotsu Ramen - 85,000đ
- ID 7: Miso Ramen - 80,000đ
- ID 8: Shoyu Ramen - 75,000đ
- ID 9: Ebi Tempura - 95,000đ
- ID 10: Vegetable Tempura - 65,000đ
- ID 11: Green Tea - 30,000đ
- ID 12: Sake - 120,000đ

### Bước 4: Thêm Cart Badge vào Header

Cập nhật tất cả các file HTML (home.html, menu.html, about.html, etc.) với cart badge:

```html
<div class="nav-right" aria-label="Liên kết biểu tượng">
  <svg>...</svg> <!-- Search icon -->
  
  <!-- Cart icon with badge -->
  <a href="cart.html" style="position: relative; display: inline-block;">
    <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" height="24" width="24">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a1 1 0 0 0 .99.61h12.72a1 1 0 0 0 .96-.73l3.38-12.07H6"></path>
    </svg>
    <span id="cartBadge" class="cart-badge">0</span>
  </a>
  
  <a href="login.html">
    <svg>...</svg> <!-- User icon -->
  </a>
</div>
```

### Bước 5: Load JavaScript Files

Thêm cart.js vào menu.html và cart.html:

```html
<script src="js/scripts.js"></script>
<script src="js/cart.js"></script>
</body>
</html>
```

---

## 📚 CẤU TRÚC DATABASE

### Tables

1. **users** - Quản lý người dùng
   - user_id, full_name, email, password_hash, phone, address

2. **categories** - Danh mục món ăn
   - category_id, category_name, category_slug

3. **menu_items** - Món ăn
   - item_id, category_id, item_name, description, price, image_url

4. **cart_items** - Giỏ hàng
   - cart_id, user_id/session_id, item_id, quantity, special_instructions

5. **orders** - Đơn hàng
   - order_id, order_number, customer info, totals, status

6. **order_items** - Chi tiết đơn hàng
   - order_item_id, order_id, item_id, quantity, unit_price

7. **reservations** - Đặt bàn
   - reservation_id, customer info, date, time, party_size, status

---

## 🛠️ API ENDPOINTS

### Cart API (`api/cart.php`)

**Get Cart Items**
```
GET /api/cart.php?action=get
Response: {success, items[], count, subtotal, totals{}}
```

**Add to Cart**
```
POST /api/cart.php?action=add
Body: {item_id, quantity, special_instructions}
Response: {success, message, action}
```

**Update Quantity**
```
POST /api/cart.php?action=update
Body: {cart_id, quantity}
Response: {success, message}
```

**Remove Item**
```
POST /api/cart.php?action=remove
Body: {cart_id}
Response: {success, message}
```

**Clear Cart**
```
POST /api/cart.php?action=clear
Response: {success, message}
```

**Get Cart Count**
```
GET /api/cart.php?action=count
Response: {success, count}
```

---

## 💻 JAVASCRIPT FUNCTIONS

### cart.js Functions

```javascript
// Thêm món vào giỏ hàng
addToCart(itemId, quantity, specialInstructions)

// Cập nhật số lượng
updateQuantity(cartId, newQuantity)

// Xóa món khỏi giỏ
removeFromCart(cartId)

// Cập nhật badge số lượng giỏ hàng
updateCartBadge()

// Hiển thị thông báo
showNotification(message, type)

// Format giá tiền
formatPrice(price)
```

---

## 🎨 CSS CLASSES

### Cart Page Classes

- `.cart-page` - Container trang giỏ hàng
- `.cart-header` - Header với title và nút
- `.cart-items-list` - Danh sách món
- `.cart-item` - Mỗi món trong giỏ
- `.cart-summary` - Tổng kết đơn hàng
- `.cart-badge` - Badge số lượng trên icon giỏ hàng
- `.empty-cart` - Trạng thái giỏ hàng trống
- `.notification` - Thông báo popup

---

## ✅ TESTING

### Test Cart Functionality

1. **Thêm món vào giỏ:**
   - Vào trang menu.html
   - Click vào món ăn bất kỳ
   - Chọn số lượng và click "THÊM VÀO GIỎ"
   - Kiểm tra badge số lượng tăng lên

2. **Xem giỏ hàng:**
   - Click vào icon giỏ hàng
   - Kiểm tra món đã thêm hiển thị đúng
   - Kiểm tra tính toán giá đúng

3. **Cập nhật số lượng:**
   - Click nút +/- để thay đổi số lượng
   - Kiểm tra giá cập nhật tự động

4. **Xóa món:**
   - Click nút trash icon
   - Kiểm tra món bị xóa
   - Badge giảm số lượng

5. **Giỏ hàng trống:**
   - Xóa hết món
   - Kiểm tra hiển thị "Giỏ hàng trống"

---

## 🔐 SECURITY FEATURES

- ✅ Prepared statements (PDO) - Chống SQL Injection
- ✅ Input sanitization - Làm sạch dữ liệu input
- ✅ Session management - Quản lý session an toàn
- ✅ CSRF protection (cần implement thêm)
- ✅ XSS protection với htmlspecialchars

---

## 📱 RESPONSIVE DESIGN

Giỏ hàng được thiết kế responsive cho:
- 🖥️ Desktop (> 968px)
- 📱 Tablet (640px - 968px)
- 📱 Mobile (< 640px)

---

## 🚧 NEXT STEPS

1. **Checkout Page**: Tạo trang thanh toán
2. **Payment Integration**: Tích hợp cổng thanh toán
3. **Order Tracking**: Theo dõi đơn hàng
4. **User Dashboard**: Trang quản lý tài khoản
5. **Admin Panel**: Quản lý đơn hàng, menu
6. **Email Notifications**: Gửi email xác nhận
7. **Promo Codes**: Hệ thống mã giảm giá

---

## 📞 SUPPORT

Nếu gặp vấn đề:
1. Kiểm tra console browser (F12)
2. Kiểm tra PHP error log
3. Kiểm tra MySQL connection
4. Đảm bảo đúng file permissions

---

## 📄 LICENSE

© 2024 Wa Japanese Cuisine - All Rights Reserved
