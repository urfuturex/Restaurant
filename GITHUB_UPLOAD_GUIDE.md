# 📤 HƯỚNG DẪN UPLOAD DỰ ÁN LÊN GITHUB

## ✅ Đã chuẩn bị

- ✅ Khởi tạo Git repository: `git init`
- ✅ Tạo `.gitignore` (bỏ qua config.php, uploads/avatars/*)
- ✅ Tạo `README.md` chi tiết
- ✅ Tạo `LICENSE` (MIT)
- ✅ Tạo `php/config.example.php` (config mẫu)
- ✅ Commit tất cả files: 71 files, 9698+ lines

## 🚀 BƯỚC 1: Tạo Repository trên GitHub

### Cách 1: Tạo bằng Web Interface

1. **Đăng nhập GitHub:**
   - Vào: https://github.com
   - Đăng nhập tài khoản của bạn

2. **Tạo repository mới:**
   ```
   - Click nút "+" ở góc trên bên phải
   - Chọn "New repository"
   ```

3. **Điền thông tin:**
   ```
   Repository name:        restaurant-reservation
   Description:            🍱 Restaurant reservation system with shopping cart, user authentication, and avatar upload
   Public/Private:         Chọn Public (hoặc Private nếu muốn)
   
   ⚠️ KHÔNG tick:
   - Add a README file
   - Add .gitignore
   - Choose a license
   
   (Vì chúng ta đã có rồi)
   ```

4. **Click "Create repository"**

### Cách 2: Tạo bằng GitHub CLI (nếu có cài)

```bash
gh repo create restaurant-reservation --public --source=. --remote=origin --push
```

## 🚀 BƯỚC 2: Liên kết với GitHub

Sau khi tạo xong repository, GitHub sẽ hiển thị hướng dẫn. Copy URL repository, ví dụ:
```
https://github.com/YOUR_USERNAME/restaurant-reservation.git
```

### Chạy lệnh trong Terminal:

```bash
# Di chuyển vào thư mục dự án
cd "/Users/naotod/Downloads/Restaurant reservation"

# Thêm remote origin (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/restaurant-reservation.git

# Kiểm tra remote đã thêm chưa
git remote -v

# Đổi tên branch thành main (nếu cần)
git branch -M main

# Push lên GitHub lần đầu
git push -u origin main
```

### Nếu bị lỗi authentication:

#### Option 1: Dùng Personal Access Token
```bash
# 1. Tạo token tại: https://github.com/settings/tokens
#    - Click "Generate new token (classic)"
#    - Chọn scopes: repo, workflow
#    - Copy token (chỉ hiện 1 lần)

# 2. Khi push, nhập:
#    Username: YOUR_GITHUB_USERNAME
#    Password: PASTE_YOUR_TOKEN_HERE
```

#### Option 2: Dùng SSH
```bash
# 1. Tạo SSH key (nếu chưa có)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. Copy public key
cat ~/.ssh/id_ed25519.pub

# 3. Thêm vào GitHub:
#    https://github.com/settings/keys
#    Click "New SSH key" → Paste key → Save

# 4. Đổi remote sang SSH
git remote set-url origin git@github.com:YOUR_USERNAME/restaurant-reservation.git

# 5. Push
git push -u origin main
```

## 🔄 BƯỚC 3: Cập nhật README.md

Sau khi push xong, cập nhật README với URL thực tế:

1. Mở file `README.md`
2. Tìm và thay thế:
   ```
   YOUR_USERNAME → username GitHub thực của bạn
   your.email@example.com → email của bạn
   ```

3. Commit và push lại:
   ```bash
   git add README.md
   git commit -m "Update README with actual GitHub info"
   git push
   ```

## 📸 BƯỚC 4: Thêm Screenshots (Optional)

Để README đẹp hơn, thêm screenshots:

```bash
# 1. Tạo thư mục screenshots
mkdir -p assets/screenshots

# 2. Chụp ảnh màn hình:
#    - Trang chủ: home.png
#    - Menu: menu.png
#    - Profile: profile.png
#    - Login: login.png

# 3. Lưu vào assets/screenshots/

# 4. Commit và push
git add assets/screenshots/
git commit -m "Add screenshots to README"
git push
```

## 🎯 BƯỚC 5: Cấu hình GitHub Pages (Optional)

Nếu muốn host website tĩnh (chỉ frontend):

```
1. Vào repository trên GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main, folder: / (root)
5. Save

→ Website sẽ có URL: https://YOUR_USERNAME.github.io/restaurant-reservation/
```

⚠️ **Lưu ý:** GitHub Pages chỉ host HTML/CSS/JS. PHP và MySQL không chạy được!

## 📝 BƯỚC 6: Tạo Description và Topics

1. Vào repository trên GitHub
2. Click biểu tượng ⚙️ bên cạnh "About"
3. Thêm:
   ```
   Description: 
   🍱 Restaurant reservation system with shopping cart, authentication, and profile management

   Website: (nếu có host)

   Topics:
   - php
   - mysql
   - restaurant
   - shopping-cart
   - authentication
   - avatar-upload
   - responsive-design
   - javascript
   - pdo
   - xampp
   ```

## 🔐 BẢO MẬT

### Files KHÔNG được commit:
✅ Đã có trong `.gitignore`:
- `php/config.php` - Thông tin database
- `uploads/avatars/*` - Ảnh người dùng (trừ .gitkeep)
- `.DS_Store` - Mac system files

### Kiểm tra trước khi push:
```bash
# Xem files sẽ được commit
git status

# Xem nội dung sẽ được commit
git diff --cached

# Nếu thấy file nhạy cảm, xóa khỏi staging:
git reset HEAD php/config.php
```

### Nếu đã commit nhầm file nhạy cảm:
```bash
# Xóa file khỏi Git nhưng giữ local
git rm --cached php/config.php

# Commit lại
git commit -m "Remove sensitive config file"
git push

# Hoặc xóa hoàn toàn khỏi history (nguy hiểm!)
git filter-branch --tree-filter 'rm -f php/config.php' HEAD
git push --force
```

## 📋 CHECKLIST TRƯỚC KHI PUSH

- [ ] Đã tạo repository trên GitHub
- [ ] Đã thêm `.gitignore` với php/config.php
- [ ] Đã tạo `php/config.example.php` để hướng dẫn
- [ ] Đã kiểm tra không có password/API key trong code
- [ ] Đã viết README.md rõ ràng
- [ ] Đã test `git status` không có file nhạy cảm
- [ ] Đã commit với message có ý nghĩa
- [ ] Đã test clone lại từ GitHub để kiểm tra

## 🔄 CÁC LỆNH GIT THƯỜNG DÙNG

### Sau này khi cập nhật code:
```bash
# 1. Kiểm tra thay đổi
git status

# 2. Thêm files cần commit
git add .                    # Thêm tất cả
git add file.php             # Thêm file cụ thể

# 3. Commit với message
git commit -m "Add new feature: order history"

# 4. Push lên GitHub
git push

# 5. Hoặc gộp thành 1 lệnh
git add . && git commit -m "Update profile page" && git push
```

### Pull code mới từ GitHub:
```bash
git pull
```

### Xem lịch sử commit:
```bash
git log --oneline
```

### Tạo branch mới:
```bash
git checkout -b feature/new-feature
# Làm việc...
git add .
git commit -m "Add new feature"
git push -u origin feature/new-feature
```

### Clone project về máy khác:
```bash
git clone https://github.com/YOUR_USERNAME/restaurant-reservation.git
cd restaurant-reservation

# Copy config
cp php/config.example.php php/config.php

# Sửa php/config.php với DB credentials
# Tạo thư mục uploads
mkdir -p uploads/avatars
chmod 777 uploads/avatars

# Import database
mysql -u root -p wa_japanese_cuisine < database/schema.sql
```

## 🌟 TỐI ƯU HÓA REPOSITORY

### 1. Thêm badges vào README:
```markdown
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PHP Version](https://img.shields.io/badge/PHP-7.4+-purple.svg)
![MySQL Version](https://img.shields.io/badge/MySQL-5.7+-orange.svg)
![Stars](https://img.shields.io/github/stars/YOUR_USERNAME/restaurant-reservation)
![Forks](https://img.shields.io/github/forks/YOUR_USERNAME/restaurant-reservation)
```

### 2. Tạo GitHub Actions (CI/CD):
Tạo file `.github/workflows/php.yml`:
```yaml
name: PHP CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '7.4'
    - name: Validate PHP syntax
      run: find . -name "*.php" -exec php -l {} \;
```

### 3. Tạo CONTRIBUTING.md:
Hướng dẫn người khác contribute vào project.

### 4. Tạo Issues templates:
`.github/ISSUE_TEMPLATE/bug_report.md`
`.github/ISSUE_TEMPLATE/feature_request.md`

## 🎉 HOÀN TẤT!

Repository của bạn giờ đã live tại:
```
https://github.com/YOUR_USERNAME/restaurant-reservation
```

### Chia sẻ project:
- ⭐ Yêu cầu bạn bè star repository
- 🔗 Share link trên mạng xã hội
- 📝 Viết blog post về project
- 💼 Thêm vào portfolio/CV

### Theo dõi:
- 👀 Watch repository để nhận thông báo
- 🐛 Tạo Issues cho bugs
- 🚀 Tạo Pull Requests cho improvements

---

**Chúc mừng bạn đã upload dự án lên GitHub! 🎊**
