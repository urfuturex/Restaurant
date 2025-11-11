# 📱 HƯỚNG DẪN UPLOAD LÊN GITHUB BẰNG GITHUB DESKTOP

## ✅ Đã chuẩn bị sẵn

- ✅ Git repository đã được khởi tạo
- ✅ Đã commit 71 files (9698+ lines code)
- ✅ Có `.gitignore` để bảo vệ file nhạy cảm
- ✅ README.md, LICENSE đầy đủ

## 🚀 HƯỚNG DẪN CHI TIẾT

### Bước 1: Mở GitHub Desktop

1. **Nếu chưa cài GitHub Desktop:**
   - Download: https://desktop.github.com
   - Cài đặt và mở app
   - Đăng nhập tài khoản GitHub của bạn

2. **Đăng nhập GitHub:**
   ```
   GitHub Desktop → Preferences → Accounts
   → Sign in to GitHub.com
   ```

### Bước 2: Thêm repository vào GitHub Desktop

Có 2 cách:

#### Cách 1: Add Existing Repository (Đơn giản nhất!)

1. **Mở GitHub Desktop**

2. **Click menu:**
   ```
   File → Add Local Repository...
   (hoặc nhấn Cmd + O)
   ```

3. **Chọn thư mục:**
   ```
   Click "Choose..."
   → Tìm và chọn: /Users/naotod/Downloads/Restaurant reservation
   → Click "Add Repository"
   ```

4. **GitHub Desktop sẽ tự động nhận diện:**
   - ✅ Repository đã có Git
   - ✅ 1 commit: "Initial commit: Restaurant reservation system with avatar upload"
   - ✅ 71 files changed

#### Cách 2: Kéo thả (Drag & Drop)

```
Kéo thư mục "Restaurant reservation" 
→ Thả vào cửa sổ GitHub Desktop
```

### Bước 3: Publish Repository lên GitHub

1. **Trong GitHub Desktop, bạn sẽ thấy:**
   ```
   Current Repository: Restaurant reservation
   Current Branch: main
   
   Và nút lớn: "Publish repository"
   ```

2. **Click nút "Publish repository"**

3. **Cửa sổ popup hiện ra, điền:**
   ```
   Name:               restaurant-reservation
   Description:        🍱 Restaurant reservation system with shopping cart, authentication, and avatar upload
   
   ☐ Keep this code private  (Bỏ tick nếu muốn Public, tick nếu muốn Private)
   
   Organization:       None (hoặc chọn org nếu có)
   ```

4. **Click "Publish Repository"**

5. **Đợi upload... (có thể mất 1-2 phút)**
   - GitHub Desktop sẽ hiển thị progress bar
   - Khi xong sẽ hiện: "Published successfully!"

### Bước 4: Xem repository trên GitHub

1. **Trong GitHub Desktop:**
   ```
   Repository → View on GitHub
   (hoặc nhấn Cmd + Shift + G)
   ```

2. **Hoặc truy cập trực tiếp:**
   ```
   https://github.com/YOUR_USERNAME/restaurant-reservation
   ```

3. **Kiểm tra:**
   - ✅ 71 files hiển thị
   - ✅ README.md hiển thị đẹp ở trang chủ
   - ✅ Không có file `php/config.php` (đã bị gitignore)
   - ✅ Có file `php/config.example.php`

## 🎨 GIA0 DIỆN GITHUB DESKTOP

```
┌─────────────────────────────────────────────┐
│  Current Repository: restaurant-reservation  │
│  Current Branch: main                        │
├─────────────────────────────────────────────┤
│                                              │
│  Changes (0)          History (1)           │
│                                              │
│  No local changes                           │
│                                              │
│  Last commit:                               │
│  Initial commit: Restaurant reservation...  │
│  by naotod • just now                       │
│                                              │
│  [Fetch origin]  [Push origin]              │
└─────────────────────────────────────────────┘
```

## 🔄 SAU NÀY KHI CẬP NHẬT CODE

### Khi sửa code trong VS Code:

1. **GitHub Desktop tự động phát hiện thay đổi:**
   ```
   Tab "Changes" sẽ hiển thị files đã sửa
   ├── ✓ js/profile.js (modified)
   ├── ✓ css/styles.css (modified)
   └── + api/orders.php (new file)
   ```

2. **Xem diff (thay đổi):**
   ```
   Click vào file → Xem màu xanh (added) / đỏ (removed)
   ```

3. **Commit:**
   ```
   Bên dưới cùng:
   
   Summary (required):  Update profile page styling
   Description:         Added responsive design for mobile
   
   → Click "Commit to main"
   ```

4. **Push lên GitHub:**
   ```
   Click nút "Push origin" ở trên
   (hoặc nhấn Cmd + P)
   ```

5. **Xong!** Repository trên GitHub đã cập nhật!

## 📝 CÁC THAO TÁC THƯỜNG DÙNG

### ✅ Commit thay đổi:
```
1. Sửa code trong VS Code
2. GitHub Desktop tự động detect
3. Viết commit message
4. Click "Commit to main"
5. Click "Push origin"
```

### ✅ Pull code mới từ GitHub:
```
Click nút "Fetch origin"
→ Nếu có update: "Pull origin"
```

### ✅ Tạo branch mới:
```
Current Branch: main ▼
→ Click dropdown
→ "New Branch..."
→ Nhập tên: feature/order-history
→ "Create Branch"
```

### ✅ Xem history:
```
Click tab "History"
→ Xem tất cả commits
→ Click vào commit để xem chi tiết
```

### ✅ Discard changes (hủy thay đổi):
```
Right-click vào file
→ "Discard Changes..."
```

### ✅ Stash changes (tạm giữ):
```
Branch menu → Stash All Changes
(Để chuyển branch mà không commit)
```

## 🔧 TROUBLESHOOTING

### ❌ Lỗi: "Repository not found"
**Giải pháp:**
```
GitHub Desktop → Preferences → Accounts
→ Sign out → Sign in lại
```

### ❌ Lỗi: "Permission denied"
**Giải pháp:**
```
GitHub Desktop tự động dùng HTTPS authentication
Đăng nhập lại trong Preferences → Accounts
```

### ❌ Không thấy nút "Publish repository"
**Nguyên nhân:** Repository đã được publish rồi
**Kiểm tra:**
```
Repository → View on GitHub
Nếu mở được là đã publish rồi!
```

### ❌ Push bị reject
**Giải pháp:**
```
1. Fetch origin trước
2. Pull origin (nếu có update)
3. Resolve conflicts (nếu có)
4. Push lại
```

## 🎯 WORKFLOW KHUYẾN NGHỊ

### Khi làm việc hàng ngày:

```
1. MỞ GITHUB DESKTOP
   ↓
2. FETCH ORIGIN (kiểm tra update)
   ↓
3. MỞ VS CODE - Sửa code
   ↓
4. QUAY LẠI GITHUB DESKTOP
   ↓
5. XEM CHANGES - Review thay đổi
   ↓
6. COMMIT với message rõ ràng
   ↓
7. PUSH ORIGIN lên GitHub
   ↓
8. DONE! ✅
```

### Commit messages tốt:

✅ **TỐT:**
```
Add avatar upload feature
Fix login redirect bug
Update profile page styling
Remove unused CSS
```

❌ **KHÔNG TỐT:**
```
update
fix bug
changes
test
```

## 📱 TÍNH NĂNG HAY CỦA GITHUB DESKTOP

### 1. Visual Diff
- Xem thay đổi code với màu sắc rõ ràng
- Split view / Unified view
- Dễ review trước khi commit

### 2. Conflict Resolution
- Tự động detect merge conflicts
- UI để resolve conflicts
- Không cần command line

### 3. Branch Management
- Tạo, xóa, merge branches dễ dàng
- Visual branch graph
- Switch branches 1 click

### 4. Stash
- Tạm cất thay đổi khi cần switch branch
- Apply stash sau khi quay lại

### 5. Undo
- Undo commit (nếu chưa push)
- Revert commit (nếu đã push)
- Amend commit message

### 6. Repository Settings
```
Repository → Repository Settings...
→ Ignored Files (.gitignore)
→ Git Config
→ Remotes
```

## 🌟 TIPS & TRICKS

### Tip 1: Keyboard Shortcuts
```
Cmd + 1        →  Changes tab
Cmd + 2        →  History tab
Cmd + T        →  Filter files
Cmd + Shift + F →  Find in changes
Cmd + ,        →  Preferences
Cmd + Shift + G →  View on GitHub
Cmd + P        →  Push
Cmd + Shift + P →  Pull
```

### Tip 2: .gitignore Editor
```
Repository → Repository Settings
→ Ignored Files
→ Thêm/sửa trực tiếp trong GitHub Desktop
```

### Tip 3: External Editor
```
Preferences → Integrations
→ External Editor: Visual Studio Code
→ Sau này click "Open in Visual Studio Code" 1 cái!
```

### Tip 4: Compare Branches
```
Branch menu → Compare to Branch...
→ Chọn branch khác
→ Xem diff giữa 2 branches
```

### Tip 5: Cherry Pick
```
Right-click vào commit trong History
→ "Cherry-pick Commit..."
→ Apply commit đó vào branch hiện tại
```

## 📊 KIỂM TRA SAU KHI PUBLISH

### ✅ Checklist:

- [ ] Repository hiển thị trên GitHub: `https://github.com/YOUR_USERNAME/restaurant-reservation`
- [ ] README.md hiển thị đẹp ở trang chủ
- [ ] 71 files đã được upload
- [ ] File `php/config.php` KHÔNG có (bị gitignore)
- [ ] File `php/config.example.php` có
- [ ] Thư mục `uploads/avatars/` có file `.gitkeep`
- [ ] LICENSE file có
- [ ] Có thể clone về máy khác: `git clone https://github.com/YOUR_USERNAME/restaurant-reservation.git`

## 🎉 XEM KẾT QUẢ

Sau khi publish xong:

### Trên GitHub.com:
```
✅ Repository page đẹp với README
✅ Code browser để xem files
✅ Commit history
✅ Issues, Pull Requests tabs
✅ Settings để quản lý
```

### Trên GitHub Desktop:
```
✅ Fetch/Push buttons để sync
✅ Branch selector
✅ Changes detection
✅ History viewer
✅ Easy commit workflow
```

## 📚 HỌC THÊM

### GitHub Desktop Documentation:
- https://docs.github.com/en/desktop

### Video Tutorials:
- YouTube: "GitHub Desktop Tutorial"
- GitHub Skills: https://skills.github.com

### Thực hành:
```
1. Thử sửa 1 file trong VS Code
2. Xem GitHub Desktop detect
3. Commit và push
4. Xem thay đổi trên GitHub.com
5. Thử tạo branch mới
6. Merge branch
```

---

## 🎯 TÓM TẮT NHANH

```
1. Mở GitHub Desktop
   ↓
2. File → Add Local Repository
   ↓
3. Chọn thư mục "Restaurant reservation"
   ↓
4. Click "Publish repository"
   ↓
5. Điền thông tin → Publish
   ↓
6. DONE! Repository đã lên GitHub! 🎉
```

**Siêu đơn giản với GitHub Desktop! 🚀**
