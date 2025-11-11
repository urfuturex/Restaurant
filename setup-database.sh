#!/bin/bash

# ================================================
# SCRIPT TỰ ĐỘNG CÀI ĐẶT DATABASE CHO XAMPP
# ================================================

echo "=================================="
echo "WA JAPANESE CUISINE - DATABASE SETUP"
echo "=================================="
echo ""

# Màu sắc cho terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Đường dẫn XAMPP trên macOS
MYSQL_PATH="/Applications/XAMPP/xamppfiles/bin/mysql"
MYSQLADMIN_PATH="/Applications/XAMPP/xamppfiles/bin/mysqladmin"

# Thông tin database
DB_NAME="wa_japanese_cuisine"
DB_USER="root"
DB_PASS=""

# Đường dẫn đến file schema
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCHEMA_FILE="$SCRIPT_DIR/database/schema.sql"

# Kiểm tra XAMPP đã cài đặt chưa
if [ ! -f "$MYSQL_PATH" ]; then
    echo -e "${RED}❌ XAMPP chưa được cài đặt!${NC}"
    echo "Vui lòng cài đặt XAMPP từ: https://www.apachefriends.org/download.html"
    exit 1
fi

echo -e "${GREEN}✓ Tìm thấy XAMPP${NC}"

# Kiểm tra MySQL đã chạy chưa
if ! pgrep -x "mysqld" > /dev/null; then
    echo -e "${YELLOW}⚠ MySQL chưa chạy!${NC}"
    echo "Vui lòng:"
    echo "1. Mở XAMPP Control Panel"
    echo "2. Click 'Start' cho MySQL"
    echo "3. Chạy lại script này"
    exit 1
fi

echo -e "${GREEN}✓ MySQL đang chạy${NC}"

# Kiểm tra file schema tồn tại
if [ ! -f "$SCHEMA_FILE" ]; then
    echo -e "${RED}❌ Không tìm thấy file schema.sql!${NC}"
    echo "File cần tìm: $SCHEMA_FILE"
    exit 1
fi

echo -e "${GREEN}✓ Tìm thấy file schema.sql${NC}"
echo ""

# Tạo database
echo "Đang tạo database '$DB_NAME'..."
if [ -z "$DB_PASS" ]; then
    # Không có password
    $MYSQL_PATH -u $DB_USER -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
else
    # Có password
    $MYSQL_PATH -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database đã được tạo thành công!${NC}"
else
    echo -e "${RED}❌ Lỗi khi tạo database${NC}"
    exit 1
fi

# Import schema
echo "Đang import schema và dữ liệu mẫu..."
if [ -z "$DB_PASS" ]; then
    $MYSQL_PATH -u $DB_USER $DB_NAME < "$SCHEMA_FILE" 2>/dev/null
else
    $MYSQL_PATH -u $DB_USER -p$DB_PASS $DB_NAME < "$SCHEMA_FILE" 2>/dev/null
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Import dữ liệu thành công!${NC}"
else
    echo -e "${RED}❌ Lỗi khi import dữ liệu${NC}"
    exit 1
fi

echo ""
echo "=================================="
echo -e "${GREEN}✅ CÀI ĐẶT HOÀN TẤT!${NC}"
echo "=================================="
echo ""

# Hiển thị thống kê
echo "Thông tin database:"
echo "-----------------------------------"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: localhost"
echo ""

# Đếm số bảng
TABLE_COUNT=$($MYSQL_PATH -u $DB_USER -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_NAME';" 2>/dev/null)
echo "Số bảng: $TABLE_COUNT"

# Đếm số món ăn
MENU_COUNT=$($MYSQL_PATH -u $DB_USER -N -e "SELECT COUNT(*) FROM $DB_NAME.menu_items;" 2>/dev/null)
echo "Số món ăn mẫu: $MENU_COUNT"

echo ""
echo "Bước tiếp theo:"
echo "-----------------------------------"
echo "1. Copy project vào folder:"
echo "   /Applications/XAMPP/xamppfiles/htdocs/"
echo ""
echo "2. Truy cập website:"
echo "   http://localhost/Restaurant%20reservation/menu.html"
echo ""
echo "3. Kiểm tra kết nối database:"
echo "   http://localhost/Restaurant%20reservation/test-db.php"
echo ""
echo "4. Quản lý database qua phpMyAdmin:"
echo "   http://localhost/phpmyadmin"
echo ""
echo -e "${GREEN}Chúc bạn thành công! 🎉${NC}"
