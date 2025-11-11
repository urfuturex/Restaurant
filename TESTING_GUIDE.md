# HƯỚNG DẪN TEST GIỎ HÀNG - WA JAPANESE CUISINE

## 🚀 CÁCH TEST NHANH (KHÔNG CẦN DATABASE)

Vì bạn chưa setup database, tôi sẽ hướng dẫn cách test giỏ hàng với LocalStorage (lưu trên browser).

### Bước 1: Tạo Mock API (Test không cần server)

Tạo file `js/cart-mock.js` để test giỏ hàng:

```javascript
// Mock Cart Data in LocalStorage
const CART_KEY = 'wa_cart_items';

// Get cart from localStorage
function getCartFromStorage() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage  
function saveCartToStorage(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Mock API - Get Cart
async function mockGetCart() {
    const items = getCartFromStorage();
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
        success: true,
        items: items,
        count: items.length,
        subtotal: subtotal,
        totals: {
            subtotal: subtotal,
            discount: 0,
            tax: 0,
            delivery_fee: 0,
            total: subtotal
        }
    };
}

// Mock API - Add to Cart
async function mockAddToCart(itemId, quantity, specialInstructions) {
    const cart = getCartFromStorage();
    
    // Sample menu items (tương ứng với ID trong menu.html)
    const menuItems = {
        1: { name: 'Súp cá Hamo và nấm tuyết tùng', price: 295000, image: 'assets/menu/menu1.jpg' },
        2: { name: 'Cá hồi Phù Si bọc gỗ Tuyết tráng nướng', price: 320000, image: 'assets/menu/menu2.jpg' },
        3: { name: 'Cá hồi Phù Si hấp Kabuka', price: 280000, image: 'assets/menu/menu3.jpg' },
        4: { name: 'Thịt heo tuyết nướng', price: 585000, image: 'assets/menu/menu4.jpg' },
        5: { name: 'Chân cua King Crab nướng xốt uni', price: 980000, image: 'assets/menu/menu5.jpg' },
        6: { name: 'Chân cua King Crab nướng', price: 465000, image: 'assets/menu/menu6.jpg' },
        7: { name: 'Món 7', price: 350000, image: 'assets/menu/menu7.jpg' },
    };
    
    const item = menuItems[itemId];
    if (!item) {
        return { success: false, message: 'Món không tồn tại' };
    }
    
    // Check if item exists in cart
    const existingIndex = cart.findIndex(i => i.item_id === itemId);
    
    if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            cart_id: Date.now(),
            item_id: itemId,
            item_name: item.name,
            price: item.price,
            quantity: quantity,
            image_url: item.image,
            description: '',
            item_total: item.price * quantity,
            special_instructions: specialInstructions
        });
    }
    
    saveCartToStorage(cart);
    return { success: true, message: 'Đã thêm vào giỏ hàng' };
}

// Mock API - Update Quantity
async function mockUpdateQuantity(cartId, quantity) {
    const cart = getCartFromStorage();
    const item = cart.find(i => i.cart_id === cartId);
    
    if (item) {
        item.quantity = quantity;
        item.item_total = item.price * quantity;
        saveCartToStorage(cart);
        return { success: true, message: 'Đã cập nhật' };
    }
    
    return { success: false, message: 'Không tìm thấy món' };
}

// Mock API - Remove Item
async function mockRemoveFromCart(cartId) {
    let cart = getCartFromStorage();
    cart = cart.filter(i => i.cart_id !== cartId);
    saveCartToStorage(cart);
    return { success: true, message: 'Đã xóa' };
}

// Mock API - Get Count
async function mockGetCartCount() {
    const cart = getCartFromStorage();
    return { success: true, count: cart.length };
}
```

### Bước 2: Cập nhật cart.js để sử dụng Mock

Thêm vào đầu file `js/cart.js`:

```javascript
// Use mock data for testing
const USE_MOCK = true; // Set to false when you have real API
```

Sau đó sửa các function để sử dụng mock khi USE_MOCK = true:

```javascript
async function getCart() {
    if (USE_MOCK) return mockGetCart();
    // ... existing code
}

async function addToCart(itemId, quantity, specialInstructions) {
    if (USE_MOCK) {
        const result = await mockAddToCart(itemId, quantity, specialInstructions || '');
        if (result.success) {
            showNotification(result.message, 'success');
            updateCartBadge();
            const popup = document.getElementById('menuPopup');
            if (popup) popup.classList.remove('active');
        }
        return result;
    }
    // ... existing code
}
```

### Bước 3: Load Mock Script

Thêm vào `menu.html` và `cart.html` TRƯỚC `cart.js`:

```html
<script src="js/cart-mock.js"></script>
<script src="js/cart.js"></script>
```

## ✅ TEST WORKFLOW

### Test 1: Thêm món vào giỏ
1. Mở `menu.html`
2. Click vào bất kỳ món ăn nào
3. Popup hiện ra với số lượng
4. Click "THÊM VÀO GIỎ"
5. Kiểm tra:
   - Thông báo "Đã thêm vào giỏ hàng" hiện ra
   - Badge số lượng trên icon giỏ hàng tăng lên
   - Popup đóng lại

### Test 2: Xem giỏ hàng
1. Click vào icon giỏ hàng (shopping cart) ở header
2. Trang `cart.html` mở ra
3. Kiểm tra:
   - Món vừa thêm hiển thị trong bảng
   - Ảnh, tên, số lượng, giá đúng
   - Tổng tiền tính đúng (Subtotal + Service Fee = Total)

### Test 3: Cập nhật số lượng
1. Ở trang giỏ hàng, click nút "+" để tăng số lượng
2. Click nút "−" để giảm số lượng
3. Kiểm tra:
   - Số lượng thay đổi
   - Giá món cập nhật
   - Tổng tiền cập nhật
   - Badge cập nhật

### Test 4: Xóa món
1. Click nút trash icon (🗑️) bên cạnh món
2. Kiểm tra:
   - Món biến mất khỏi giỏ
   - Tổng tiền giảm
   - Badge giảm
   - Nếu xóa hết → hiện "Giỏ hàng trống"

### Test 5: Badge trên nhiều trang
1. Thêm món từ trang menu
2. Chuyển sang trang khác (home.html, about.html)
3. Kiểm tra badge vẫn hiển thị đúng số lượng

## 🔧 DEBUG

Nếu gặp lỗi, mở **Developer Tools** (F12):

### Console Tab
- Kiểm tra lỗi JavaScript
- Xem log của các function

### Application Tab → Local Storage
- Xem dữ liệu giỏ hàng được lưu
- Key: `wa_cart_items`
- Có thể xóa để reset giỏ hàng

### Network Tab
- Xem các request API (khi dùng real backend)

## 📝 NOTES

- Mock data chỉ dùng để test giao diện
- Data lưu trên browser, clear browser cache = mất data
- Khi ready, switch `USE_MOCK = false` và setup database thật

## 🎯 NEXT STEPS SAU KHI TEST OK

1. Setup MySQL database
2. Import `database/schema.sql`
3. Config `php/config.php`
4. Set `USE_MOCK = false` trong cart.js
5. Test với real API

---

Happy Testing! 🚀
