/**
 * Checkout Page JavaScript
 * Handles checkout form and displays cart items
 */

// API Base URL
const API_URL = 'api/cart.php';

// Mock menu data (matching cart-mock.js)
const MENU_ITEMS = {
    1: { id: 1, name: 'Súp cá Hamo và nấm tuyết tùng', price: 295000, image: 'assets/menu/menu1.jpg' },
    2: { id: 2, name: 'Cá hồi Phù Si bọc gỗ Tuyết tráng nướng', price: 320000, image: 'assets/menu/menu2.jpg' },
    3: { id: 3, name: 'Cá hồi Phù Si hấp Kabuka', price: 280000, image: 'assets/menu/menu3.jpg' },
    4: { id: 4, name: 'Thịt heo tuyết nướng', price: 585000, image: 'assets/menu/menu4.jpg' },
    5: { id: 5, name: 'Chân cua King Crab nướng xốt uni', price: 980000, image: 'assets/menu/menu5.jpg' },
    6: { id: 6, name: 'Chân cua King Crab nướng', price: 465000, image: 'assets/menu/menu6.jpg' },
    7: { id: 7, name: 'Chân cua King Crab phủ thạch mỹ vị', price: 990000, image: 'assets/menu/menu7.jpg' },
    8: { id: 8, name: 'Bào ngư phủ uni nướng Iseche', price: 450000, image: 'assets/menu/menu8.jpg' },
    9: { id: 9, name: 'Bào ngư uni cúp Wagyu', price: 850000, image: 'assets/menu/menu9.jpg' }
};

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    loadCheckoutItems();
    updateCartBadge();
    loadUserInfo(); // Auto-fill user info
});

/**
 * Load user info and auto-fill form
 */
function loadUserInfo() {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            
            // Auto-fill full name
            const fullNameInput = document.getElementById('fullName');
            if (fullNameInput && user.name) {
                fullNameInput.value = user.name;
            }
            
            // Auto-fill phone if available
            const phoneInput = document.getElementById('phoneNumber');
            if (phoneInput && user.phone) {
                phoneInput.value = user.phone;
            }
            
            // Auto-fill address if available
            const addressInput = document.getElementById('district');
            if (addressInput && user.address) {
                addressInput.value = user.address;
            }
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

/**
 * Update cart badge count in header
 */
async function updateCartBadge() {
    try {
        // Try localStorage first
        const localCart = localStorage.getItem('cart');
        if (localCart) {
            const cartItems = JSON.parse(localCart);
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            
            const badge = document.getElementById('cartBadge');
            if (badge) {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
            }
            return;
        }
        
        // Fallback to API
        const response = await fetch(`${API_URL}?action=count`);
        const data = await response.json();
        
        const badge = document.getElementById('cartBadge');
        if (badge && data.success) {
            badge.textContent = data.count;
            badge.style.display = data.count > 0 ? 'flex' : 'none';
        }
    } catch (error) {
        console.error('Error updating cart badge:', error);
        // Try to get from localStorage as fallback
        const localCart = localStorage.getItem('cart');
        if (localCart) {
            const cartItems = JSON.parse(localCart);
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            
            const badge = document.getElementById('cartBadge');
            if (badge) {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        }
    }
}

/**
 * Load cart items for checkout display
 */
async function loadCheckoutItems() {
    try {
        // Try to load from localStorage first (for mock testing)
        const localCart = localStorage.getItem('cart');
        
        console.log('LocalStorage cart:', localCart); // Debug
        
        if (localCart) {
            // Using mock data from localStorage
            const cartItems = JSON.parse(localCart);
            
            console.log('Parsed cart items:', cartItems); // Debug
            
            if (cartItems && cartItems.length > 0) {
                // Transform localStorage cart to display format
                const items = cartItems.map(cartItem => {
                    console.log('Processing cart item:', cartItem); // Debug
                    const itemId = cartItem.item_id || cartItem.id;
                    console.log('Item ID:', itemId); // Debug
                    const menuItem = MENU_ITEMS[itemId];
                    console.log('Menu item found:', menuItem); // Debug
                    
                    return {
                        id: itemId,
                        name: menuItem ? menuItem.name : 'Unknown Item',
                        quantity: cartItem.quantity,
                        price: menuItem ? menuItem.price : 0,
                        total_price: menuItem ? menuItem.price * cartItem.quantity : 0,
                        image_url: menuItem ? menuItem.image : 'assets/menu/default.jpg'
                    };
                });
                
                console.log('Transformed items:', items); // Debug
                
                // Calculate totals
                const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
                const serviceFee = subtotal * 0.05; // 5% service fee
                const total = subtotal + serviceFee;
                const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
                
                const totals = {
                    subtotal: subtotal,
                    service_fee: serviceFee,
                    total: total,
                    total_items: totalItems
                };
                
                console.log('Totals:', totals); // Debug
                
                displayCheckoutItems(items, totals);
                return;
            }
        }
        
        // If no localStorage data, redirect back to cart
        alert('Giỏ hàng trống. Vui lòng thêm món ăn vào giỏ hàng trước!');
        window.location.href = 'cart.html';
        
        // If no localStorage, try API
        const response = await fetch(`${API_URL}?action=get`);
        const data = await response.json();
        
        if (data.success && data.items && data.items.length > 0) {
            displayCheckoutItems(data.items, data.totals);
        } else {
            // If cart is empty, redirect back to cart page
            alert('Giỏ hàng trống. Vui lòng thêm món ăn!');
            window.location.href = 'cart.html';
        }
    } catch (error) {
        console.error('Error loading checkout items:', error);
        alert('Có lỗi xảy ra khi tải thông tin đơn hàng!');
    }
}

/**
 * Display checkout items in table
 */
function displayCheckoutItems(items, totals) {
    const tbody = document.getElementById('checkoutItemsBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        
        // Product name with image
        const nameCell = document.createElement('td');
        nameCell.innerHTML = `
            <div class="checkout-item-info">
                <img src="${item.image_url || 'assets/menu/default.jpg'}" alt="${item.name}" class="checkout-item-image">
                <span>${item.name}</span>
            </div>
        `;
        
        // Portion (quantity)
        const portionCell = document.createElement('td');
        portionCell.textContent = `(x${item.quantity})`;
        
        // Price
        const priceCell = document.createElement('td');
        priceCell.textContent = formatPrice(item.total_price);
        
        row.appendChild(nameCell);
        row.appendChild(portionCell);
        row.appendChild(priceCell);
        
        tbody.appendChild(row);
    });
    
    // Update summary
    updateCheckoutSummary(totals);
}

/**
 * Update checkout summary
 */
function updateCheckoutSummary(totals) {
    const subtotal = totals.subtotal || 0;
    const serviceFee = totals.service_fee || 0;
    const total = totals.total || 0;
    const itemCount = totals.total_items || 0;
    
    document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('checkoutServiceFees').textContent = formatPrice(serviceFee);
    document.getElementById('checkoutTotal').textContent = formatPrice(total);
    document.getElementById('checkoutItemCount').textContent = itemCount;
}

/**
 * Format price to Vietnamese currency
 */
function formatPrice(price) {
    const numPrice = parseFloat(price) || 0;
    return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numPrice) + ' đ';
}

/**
 * Handle continue to payment
 */
function handleContinueToPayment() {
    // Validate form
    const fullName = document.getElementById('fullName').value.trim();
    const district = document.getElementById('district').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    
    if (!fullName) {
        alert('Vui lòng nhập họ và tên!');
        document.getElementById('fullName').focus();
        return;
    }
    
    if (!district) {
        alert('Vui lòng nhập địa chỉ!');
        document.getElementById('district').focus();
        return;
    }
    
    if (!phoneNumber) {
        alert('Vui lòng nhập số điện thoại!');
        document.getElementById('phoneNumber').focus();
        return;
    }
    
    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        alert('Số điện thoại không hợp lệ! Vui lòng nhập 10 chữ số.');
        document.getElementById('phoneNumber').focus();
        return;
    }
    
    // Get cart data
    const localCart = localStorage.getItem('cart');
    if (!localCart) {
        alert('Giỏ hàng trống!');
        window.location.href = 'cart.html';
        return;
    }
    
    const cartItems = JSON.parse(localCart);
    
    // Calculate totals
    const items = cartItems.map(cartItem => {
        const itemId = cartItem.item_id || cartItem.id;
        const menuItem = MENU_ITEMS[itemId];
        return {
            id: itemId,
            name: menuItem ? menuItem.name : 'Unknown Item',
            quantity: cartItem.quantity,
            price: menuItem ? menuItem.price : 0,
            total_price: menuItem ? menuItem.price * cartItem.quantity : 0
        };
    });
    
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Save order data to sessionStorage
    const orderData = {
        customer: {
            fullName,
            district,
            phoneNumber
        },
        note: document.getElementById('orderNote').value.trim(),
        items,
        subtotal,
        serviceFee,
        total,
        totalItems,
        createdAt: new Date().toISOString()
    };
    
    sessionStorage.setItem('orderData', JSON.stringify(orderData));
    
    // Navigate to payment page
    window.location.href = 'payment.html';
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
