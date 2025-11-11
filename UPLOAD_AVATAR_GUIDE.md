# 📸 HƯỚNG DẪN UPLOAD ẢNH PROFILE

## ✅ Đã cài đặt

### Tính năng mới:
- ✅ Click nút camera trên avatar → Chọn ảnh
- ✅ Ảnh hiện preview ngay lập tức
- ✅ Upload lên server tự động
- ✅ Lưu đường dẫn ảnh vào database
- ✅ Ảnh được lưu trong folder `uploads/avatars/`

### Files đã tạo/cập nhật:
- ✅ `js/profile.js` - Thêm hàm upload avatar
- ✅ `api/upload-avatar.php` - API xử lý upload
- ✅ `api/get-profile.php` - Trả về avatar URL
- ✅ `uploads/avatars/` - Thư mục lưu ảnh (chmod 777)
- ✅ `uploads/.htaccess` - Cho phép truy cập ảnh

## 🚀 Cách test

### Bước 1: Đăng nhập
```
1. Vào: http://localhost/Restaurant%20reservation/login.html
2. Đăng nhập với tài khoản đã tạo
3. Click icon user → Chuyển sang profile.html
```

### Bước 2: Upload ảnh
```
1. Click vào nút camera (icon camera trên avatar)
2. Chọn file ảnh từ máy (JPG, PNG, GIF, WebP)
3. Ảnh sẽ hiện preview ngay lập tức
4. Đợi thông báo "Cập nhật ảnh đại diện thành công!"
```

### Bước 3: Kiểm tra
```
1. Refresh trang → Ảnh vẫn còn
2. Đăng xuất → Đăng nhập lại → Ảnh vẫn hiển thị
3. Xem trong database:
   http://localhost/Restaurant%20reservation/view-users.php
   → Cột "avatar" có giá trị: uploads/avatars/avatar_1_xxxxx.jpg
```

### Bước 4: Xem file ảnh
```
1. Truy cập trực tiếp:
   http://localhost/Restaurant%20reservation/uploads/avatars/
   
2. Hoặc xem qua Finder:
   /Applications/XAMPP/xamppfiles/htdocs/Restaurant reservation/uploads/avatars/
```

## 🔍 Tính năng chi tiết

### Validation:
- ✅ Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)
- ✅ Kích thước tối đa: 5MB
- ✅ Hiển thị lỗi nếu file không hợp lệ

### Preview:
- ✅ Ảnh hiện ngay khi chọn (không cần click Lưu)
- ✅ Sử dụng FileReader để đọc ảnh
- ✅ Preview trong thẻ <img> hiện tại

### Upload:
- ✅ Tự động upload sau khi chọn ảnh
- ✅ Tên file: `avatar_{user_id}_{timestamp}.jpg`
- ✅ Lưu vào `uploads/avatars/`
- ✅ Cập nhật database (bảng users, cột avatar)
- ✅ Lưu vào localStorage để giữ khi reload

### Database:
- ✅ Tự động thêm cột `avatar` nếu chưa có
- ✅ Lưu đường dẫn relative: `uploads/avatars/avatar_1_xxxxx.jpg`
- ✅ Hiển thị trong profile mỗi khi load

## 📂 Cấu trúc Files

```
Restaurant reservation/
├── uploads/
│   ├── .htaccess          ← Cho phép truy cập ảnh
│   └── avatars/           ← Thư mục lưu avatar (chmod 777)
│       ├── avatar_1_1699700000.jpg
│       ├── avatar_2_1699700123.jpg
│       └── ...
├── api/
│   ├── upload-avatar.php  ← API upload ảnh
│   └── get-profile.php    ← API lấy profile (có avatar)
└── js/
    └── profile.js         ← JavaScript upload + preview
```

## 🎯 Luồng hoạt động

```
1. User click nút camera
   ↓
2. Mở dialog chọn file
   ↓
3. User chọn ảnh
   ↓
4. FileReader đọc ảnh → Preview ngay
   ↓
5. Upload file lên server (FormData)
   ↓
6. Server validate + lưu file
   ↓
7. Server cập nhật database
   ↓
8. Trả về avatar_url
   ↓
9. Lưu vào localStorage
   ↓
10. Hiển thị thông báo thành công
```

## 🔧 Troubleshooting

### Lỗi: "Lỗi khi lưu ảnh"
**Nguyên nhân:** Thư mục uploads không có quyền ghi
**Giải pháp:**
```bash
chmod 777 /Applications/XAMPP/xamppfiles/htdocs/Restaurant\ reservation/uploads/avatars
```

### Lỗi: Ảnh không hiển thị sau upload
**Nguyên nhân:** Đường dẫn ảnh sai hoặc .htaccess chặn
**Giải pháp:**
1. Kiểm tra file .htaccess trong uploads/
2. Test truy cập trực tiếp: http://localhost/Restaurant%20reservation/uploads/avatars/avatar_1_xxx.jpg

### Lỗi: "Column 'avatar' doesn't exist"
**Nguyên nhân:** Database chưa có cột avatar
**Giải pháp:**
```sql
-- Chạy trong phpMyAdmin
ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL;
```
(API sẽ tự động chạy lệnh này, nhưng có thể bị lỗi permission)

### Lỗi: Preview không hiện
**Nguyên nhân:** JavaScript không load hoặc có lỗi
**Giải pháp:**
1. Hard refresh: Cmd + Shift + R
2. Mở Console (F12) xem lỗi
3. Kiểm tra file profile.js đã được copy vào htdocs chưa

### Ảnh hiện nhưng mất khi reload
**Nguyên nhân:** Upload thất bại, chỉ có preview local
**Giải pháp:**
1. Mở Network tab (F12) → Xem request upload-avatar.php
2. Kiểm tra response có success: true không
3. Xem Console có lỗi không

## 📝 Database Schema Update

Thêm cột avatar vào bảng users:

```sql
ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL AFTER address;
```

Hoặc API sẽ tự động thêm khi upload lần đầu.

## ✅ Checklist test

- [ ] Click nút camera hiển thị dialog chọn file
- [ ] Chọn ảnh JPG → Preview ngay lập tức
- [ ] Thông báo "Cập nhật ảnh đại diện thành công!"
- [ ] Ảnh vẫn hiển thị sau khi reload trang
- [ ] Ảnh vẫn hiển thị sau khi logout → login lại
- [ ] File ảnh tồn tại trong uploads/avatars/
- [ ] Database có giá trị trong cột avatar
- [ ] Có thể truy cập ảnh qua URL trực tiếp
- [ ] Upload ảnh lớn hơn 5MB → Báo lỗi
- [ ] Upload file không phải ảnh → Báo lỗi

## 🎨 UI/UX

### Nút Upload:
- Icon camera màu trắng
- Background màu nâu (#8B4513)
- Hover: Đậm hơn (#6d3410)
- Position: Góc dưới bên phải của avatar
- Size: 40x40px, border radius 50%

### Preview:
- Hiện ngay khi chọn (< 100ms)
- Smooth transition
- Giữ tỷ lệ ảnh với object-fit: cover

### Notification:
- "Cập nhật ảnh đại diện thành công!" (màu xanh)
- Hoặc lỗi chi tiết (màu đỏ)
- Auto hide sau 4 giây

## 🚀 Test ngay

```
1. Vào: http://localhost/Restaurant%20reservation/profile.html
2. Click nút camera trên avatar
3. Chọn ảnh
4. Xem preview ngay lập tức
5. Đợi thông báo thành công
6. Refresh trang → Ảnh vẫn còn ✅
```

**Chúc bạn thành công! 📸**
