# 🔐 TEST CHỨC NĂNG ĐĂNG KÝ / ĐĂNG NHẬP

## ✅ Đã cài đặt

### Backend API
- ✅ `api/register.php` - API đăng ký tài khoản
- ✅ `api/login.php` - API đăng nhập
- ✅ `js/auth.js` - JavaScript xử lý form

### Frontend Pages
- ✅ `signup.html` - Trang đăng ký (đã load auth.js)
- ✅ `login.html` - Trang đăng nhập (đã load auth.js)
- ✅ `view-users.php` - Xem danh sách users trong database

## 🚀 Cách test

### Bước 1: Đảm bảo XAMPP đang chạy
```
XAMPP Control Panel:
✓ Apache - Running
✓ MySQL - Running
```

### Bước 2: Test đăng ký tài khoản

1. Mở trình duyệt và vào:
   ```
   http://localhost/Restaurant%20reservation/signup.html
   ```

2. Điền form đăng ký:
   - **Your Name**: Nguyễn Văn A
   - **Email**: test@example.com
   - **Password**: 123456

3. Click nút **"GET STARTED"**

4. Nếu thành công:
   - ✅ Thông báo: "Đăng ký thành công! Đang chuyển hướng..."
   - ✅ Tự động chuyển sang trang `menu.html` sau 1.5 giây
   - ✅ Thông tin user lưu trong localStorage

5. Nếu lỗi:
   - ❌ "Email đã được sử dụng" → Email đã tồn tại
   - ❌ "Mật khẩu phải có ít nhất 6 ký tự" → Password quá ngắn
   - ❌ "Email không hợp lệ" → Format email sai

### Bước 3: Kiểm tra trong database

1. Mở:
   ```
   http://localhost/Restaurant%20reservation/view-users.php
   ```

2. Xem danh sách users đã đăng ký:
   - ID
   - Họ tên
   - Email
   - Số điện thoại
   - Trạng thái (Hoạt động/Khóa)
   - Ngày đăng ký

3. Hoặc xem qua phpMyAdmin:
   ```
   http://localhost/phpmyadmin
   → Database: wa_japanese_cuisine
   → Table: users
   → Browse
   ```

### Bước 4: Test đăng nhập

1. Mở:
   ```
   http://localhost/Restaurant%20reservation/login.html
   ```

2. Điền thông tin:
   - **Email**: test@example.com
   - **Password**: 123456

3. Click **"LOGIN"**

4. Nếu thành công:
   - ✅ Thông báo: "Đăng nhập thành công!"
   - ✅ Chuyển sang trang menu
   - ✅ User info lưu trong localStorage

5. Nếu lỗi:
   - ❌ "Email hoặc mật khẩu không đúng"
   - ❌ "Tài khoản đã bị khóa"

## 🔍 Kiểm tra chi tiết

### 1. Xem Console Log
Mở Browser Console (F12) → Tab Console để xem:
- Request/Response từ API
- Lỗi JavaScript (nếu có)

### 2. Xem Network Tab
F12 → Tab Network → Filter: Fetch/XHR
- Xem request đến `api/register.php` hoặc `api/login.php`
- Status Code: 200 (success) hoặc 400/401 (error)
- Response JSON

### 3. Xem localStorage
F12 → Tab Application → Storage → Local Storage
- Key: `user`
- Value: `{"id":1,"name":"Nguyễn Văn A","email":"test@example.com"}`

## 📊 Cấu trúc bảng users

```sql
users
├── user_id (INT, PRIMARY KEY, AUTO_INCREMENT)
├── full_name (VARCHAR 100)
├── email (VARCHAR 100, UNIQUE)
├── password_hash (VARCHAR 255) ← Mật khẩu được mã hóa
├── phone (VARCHAR 20, NULL)
├── address (TEXT, NULL)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── is_active (BOOLEAN, DEFAULT TRUE)
```

## 🔐 Bảo mật

### Mật khẩu
- ✅ Sử dụng `password_hash()` với `PASSWORD_DEFAULT`
- ✅ Xác thực bằng `password_verify()`
- ✅ Không lưu plain text password

### Email
- ✅ Validate format email
- ✅ Check duplicate email
- ✅ Unique constraint trong database

### Session
- ✅ Lưu user_id, user_name, user_email trong session
- ✅ Có thể check `$_SESSION['user_id']` để xác thực

## 🧪 Test Cases

### Test 1: Đăng ký thành công
```
Input:
- Name: John Doe
- Email: john@example.com
- Password: password123

Expected:
✓ Status 200
✓ Response: {"success": true, "message": "Đăng ký thành công!"}
✓ User được thêm vào database
✓ Chuyển hướng sang menu.html
```

### Test 2: Email trùng
```
Input:
- Email: john@example.com (đã tồn tại)

Expected:
✗ Status 400
✗ Response: {"success": false, "message": "Email đã được sử dụng"}
✗ Form không submit
```

### Test 3: Password ngắn
```
Input:
- Password: 123 (< 6 ký tự)

Expected:
✗ Response: "Mật khẩu phải có ít nhất 6 ký tự"
✗ Form không submit
```

### Test 4: Đăng nhập sai mật khẩu
```
Input:
- Email: john@example.com
- Password: wrongpassword

Expected:
✗ Status 401
✗ Response: "Email hoặc mật khẩu không đúng"
```

## 🛠️ Troubleshooting

### Lỗi: "Method not allowed"
**Nguyên nhân:** API chỉ nhận POST request
**Giải pháp:** Kiểm tra JavaScript đang dùng method: 'POST'

### Lỗi: "Database connection failed"
**Nguyên nhân:** MySQL chưa chạy hoặc config sai
**Giải pháp:**
1. Start MySQL trong XAMPP
2. Kiểm tra `php/config.php`
3. Chạy `test-db.php` để test kết nối

### Lỗi: "Table 'users' doesn't exist"
**Nguyên nhân:** Schema chưa được import
**Giải pháp:**
1. Import file `database/schema.sql`
2. Hoặc chạy script: `./setup-database.sh`

### Lỗi: CORS hoặc fetch failed
**Nguyên nhân:** Truy cập qua `file://` thay vì `http://localhost`
**Giải pháp:**
- Phải truy cập qua: `http://localhost/Restaurant%20reservation/`
- Không được mở file HTML trực tiếp

## 📝 API Documentation

### POST /api/register.php
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đăng ký thành công!",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Email đã được sử dụng"
}
```

### POST /api/login.php
**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng"
}
```

## ✅ Checklist test

- [ ] XAMPP đã chạy (Apache + MySQL)
- [ ] Database `wa_japanese_cuisine` đã tồn tại
- [ ] Bảng `users` đã được tạo
- [ ] Truy cập qua `http://localhost/...`
- [ ] Đăng ký tài khoản mới thành công
- [ ] Thông báo "Đăng ký thành công" hiện ra
- [ ] User xuất hiện trong `view-users.php`
- [ ] User xuất hiện trong phpMyAdmin
- [ ] Password được mã hóa trong database
- [ ] Đăng nhập với tài khoản vừa tạo thành công
- [ ] Chuyển hướng sang menu.html sau khi đăng nhập
- [ ] User info lưu trong localStorage

## 🎯 Next Steps

Sau khi test thành công, bạn có thể:
1. ✅ Hiển thị tên user trên header (thay icon user)
2. ✅ Thêm nút Logout
3. ✅ Bắt buộc đăng nhập trước khi checkout
4. ✅ Lưu giỏ hàng theo user_id thay vì session_id
5. ✅ Xem lịch sử đơn hàng của user

---

**Quick Links:**
- 🔐 Đăng ký: http://localhost/Restaurant%20reservation/signup.html
- 🔑 Đăng nhập: http://localhost/Restaurant%20reservation/login.html
- 👥 Xem users: http://localhost/Restaurant%20reservation/view-users.php
- 🍱 Menu: http://localhost/Restaurant%20reservation/menu.html
