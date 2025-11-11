-- ================================================
-- WA JAPANESE CUISINE DATABASE SCHEMA
-- ================================================

-- Drop tables if exists (for fresh installation)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reservations;

-- ================================================
-- USERS TABLE
-- ================================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email)
);

-- ================================================
-- CATEGORIES TABLE
-- ================================================
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL,
    category_slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- MENU ITEMS TABLE
-- ================================================
CREATE TABLE menu_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    preparation_time INT DEFAULT 15, -- in minutes
    calories INT,
    spicy_level ENUM('none', 'mild', 'medium', 'hot', 'very_hot') DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_available (is_available),
    INDEX idx_featured (is_featured)
);

-- ================================================
-- CART ITEMS TABLE
-- ================================================
CREATE TABLE cart_items (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id VARCHAR(100), -- for guest users
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    special_instructions TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_session (session_id),
    UNIQUE KEY unique_cart_item (user_id, item_id),
    UNIQUE KEY unique_guest_cart_item (session_id, item_id)
);

-- ================================================
-- ORDERS TABLE
-- ================================================
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT,
    order_type ENUM('delivery', 'pickup', 'dine_in') DEFAULT 'delivery',
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    tax DECIMAL(10, 2) DEFAULT 0.00,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'card', 'online', 'wallet') DEFAULT 'cash',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    order_status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled') DEFAULT 'pending',
    special_instructions TEXT,
    estimated_delivery_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_orders (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_order_status (order_status),
    INDEX idx_created_at (created_at)
);

-- ================================================
-- ORDER ITEMS TABLE
-- ================================================
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL, -- stored for history
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    special_instructions TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE RESTRICT,
    INDEX idx_order (order_id)
);

-- ================================================
-- RESERVATIONS TABLE
-- ================================================
CREATE TABLE reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INT NOT NULL,
    location VARCHAR(100),
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user_reservations (user_id),
    INDEX idx_reservation_date (reservation_date),
    INDEX idx_status (status)
);

-- ================================================
-- INSERT SAMPLE CATEGORIES
-- ================================================
INSERT INTO categories (category_name, category_slug, description, display_order) VALUES
('Tất cả', 'all', 'Tất cả món ăn', 1),
('Sushi', 'sushi', 'Các loại sushi truyền thống', 2),
('Sashimi', 'sashimi', 'Cá sống tươi ngon', 3),
('Ramen', 'ramen', 'Mì ramen nóng hổi', 4),
('Tempura', 'tempura', 'Món chiên giòn', 5),
('Đồ uống', 'drinks', 'Đồ uống và trà', 6);

-- ================================================
-- INSERT SAMPLE MENU ITEMS (Matching menu.html items with data-item-id)
-- ================================================
INSERT INTO menu_items (item_id, category_id, item_name, item_slug, description, price, image_url, is_featured) VALUES
-- Items 1-7 with data-item-id attributes
(1, 3, 'Súp cá Hamo và nấm tuyết tùng', 'sup-ca-hamo', 'Súp cá Hamo tươi ngon với nấm tuyết tùng cao cấp', 295000, 'assets/menu/menu1.jpg', TRUE),
(2, 3, 'Cá hồi Phù Si bọc gỗ Tuyết tráng nướng', 'ca-hoi-phu-si-nuong', 'Cá hồi Phù Si bọc gỗ Tuyết tráng nướng thơm ngon', 320000, 'assets/menu/menu2.jpg', TRUE),
(3, 3, 'Cá hồi Phù Si hấp Kabuka', 'ca-hoi-phu-si-hap', 'Cá hồi Phù Si hấp Kabuka theo phong cách Nhật', 280000, 'assets/menu/menu3.jpg', FALSE),
(4, 4, 'Thịt heo tuyết nướng', 'thit-heo-tuyet-nuong', 'Thịt heo tuyết nướng mềm ngọt', 585000, 'assets/menu/menu4.jpg', TRUE),
(5, 2, 'Chân cua King Crab nướng xốt uni', 'chan-cua-king-crab-sot-uni', 'Chân cua King Crab nướng với xốt uni béo ngậy', 980000, 'assets/menu/menu5.jpg', TRUE),
(6, 2, 'Chân cua King Crab nướng', 'chan-cua-king-crab-nuong', 'Chân cua King Crab nướng tươi ngon', 465000, 'assets/menu/menu6.jpg', FALSE),
(7, 3, 'Chân cua King Crab phủ thạch mỹ vị', 'chan-cua-king-crab-thach', 'Chân cua King Crab phủ thạch mỹ vị độc đáo', 990000, 'assets/menu/menu7.jpg', TRUE),

-- Additional items without data-item-id (món 8-9)
(8, 3, 'Bào ngư phủ uni nướng Iseche', 'bao-ngu-uni-nuong', 'Bào ngư tươi phủ uni nướng theo phong cách Iseche', 450000, 'assets/menu/menu8.jpg', FALSE),
(9, 2, 'Bào ngư uni cúp Wagyu', 'bao-ngu-uni-wagyu', 'Bào ngư uni kết hợp với thịt bò Wagyu cao cấp', 850000, 'assets/menu/menu9.jpg', TRUE);


-- ================================================
-- USEFUL QUERIES FOR CART MANAGEMENT
-- ================================================

-- Get cart items for a user
-- SELECT ci.*, mi.item_name, mi.price, mi.image_url, (ci.quantity * mi.price) as item_total
-- FROM cart_items ci
-- JOIN menu_items mi ON ci.item_id = mi.item_id
-- WHERE ci.user_id = ? AND mi.is_available = TRUE;

-- Get cart total for a user
-- SELECT SUM(ci.quantity * mi.price) as cart_total
-- FROM cart_items ci
-- JOIN menu_items mi ON ci.item_id = mi.item_id
-- WHERE ci.user_id = ? AND mi.is_available = TRUE;

-- Add item to cart (with duplicate handling)
-- INSERT INTO cart_items (user_id, item_id, quantity)
-- VALUES (?, ?, ?)
-- ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity);

-- Update cart item quantity
-- UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND user_id = ?;

-- Remove item from cart
-- DELETE FROM cart_items WHERE cart_id = ? AND user_id = ?;

-- Clear cart after order
-- DELETE FROM cart_items WHERE user_id = ?;
