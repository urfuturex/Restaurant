/**
 * Cart Management JavaScript - MOCK VERSION
 * Uses localStorage instead of API for quick testing
 */

// Mock menu data (matching schema.sql and menu.html)
const MENU_ITEMS = {
    1: { id: 1, name: 'Súp cá Hamo và nấm tuyết tùng', price: 295000, image: 'assets/menu/menu1.jpg', description: 'Súp cá Hamo tươi ngon với nấm tuyết tùng cao cấp' },
    2: { id: 2, name: 'Cá hồi Phù Si bọc gỗ Tuyết tráng nướng', price: 320000, image: 'assets/menu/menu2.jpg', description: 'Cá hồi Phù Si bọc gỗ Tuyết tráng nướng thơm ngon' },
    3: { id: 3, name: 'Cá hồi Phù Si hấp Kabuka', price: 280000, image: 'assets/menu/menu3.jpg', description: 'Cá hồi Phù Si hấp Kabuka theo phong cách Nhật' },
    4: { id: 4, name: 'Thịt heo tuyết nướng', price: 585000, image: 'assets/menu/menu4.jpg', description: 'Thịt heo tuyết nướng mềm ngọt' },
    5: { id: 5, name: 'Chân cua King Crab nướng xốt uni', price: 980000, image: 'assets/menu/menu5.jpg', description: 'Chân cua King Crab nướng với xốt uni béo ngậy' },
    6: { id: 6, name: 'Chân cua King Crab nướng', price: 465000, image: 'assets/menu/menu6.jpg', description: 'Chân cua King Crab nướng tươi ngon' },
    7: { id: 7, name: 'Chân cua King Crab phủ thạch mỹ vị', price: 990000, image: 'assets/menu/menu7.jpg', description: 'Chân cua King Crab phủ thạch mỹ vị độc đáo' },
    8: { id: 8, name: 'Bào ngư phủ uni nướng Iseche', price: 450000, image: 'assets/menu/menu8.jpg', description: 'Bào ngư tươi phủ uni nướng theo phong cách Iseche' },
    9: { id: 9, name: 'Bào ngư uni cúp Wagyu', price: 850000, image: 'assets/menu/menu9.jpg', description: 'Bào ngư uni kết hợp với thịt bò Wagyu cao cấp' }
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
    updateCartBadge();
    
    // Continue shopping button
    const continueBtn = document.getElementById('continueShoppingBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            window.location.href = 'menu.html';
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
});

/**
 * Get cart from localStorage
 */
function getCartFromStorage() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Update cart badge count in header
 */
function updateCartBadge() {
    const cart = getCartFromStorage();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

/**
 * Add item to cart
 */
function addToCart(itemId, quantity = 1, specialInstructions = '') {
    const cart = getCartFromStorage();
    const menuItem = MENU_ITEMS[itemId];
    
    if (!menuItem) {
        showNotification('Món ăn không tồn tại!', 'error');
        return;
    }
    
    // Check if item already exists
    const existingItemIndex = cart.findIndex(item => item.item_id === itemId);
    
    if (existingItemIndex > -1) {
        // Update quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            cart_id: Date.now(), // Use timestamp as unique ID
            item_id: itemId,
            quantity: quantity,
            special_instructions: specialInstructions
        });
    }
    
    saveCartToStorage(cart);
    updateCartBadge();
    showNotification(`Đã thêm ${menuItem.name} vào giỏ hàng!`, 'success');
    
    // Close popup if it exists
    const popup = document.getElementById('menuPopup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Load and display cart items
 */
function loadCart() {
    const cart = getCartFromStorage();
    
    if (cart.length === 0) {
        showEmptyCart();
        return;
    }
    
    // Build items array with menu data
    const items = cart.map(cartItem => {
        const menuItem = MENU_ITEMS[cartItem.item_id];
        return {
            cart_id: cartItem.cart_id,
            item_id: cartItem.item_id,
            quantity: cartItem.quantity,
            item_name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            item_total: menuItem.price * cartItem.quantity,
            image_url: menuItem.image
        };
    });
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.item_total, 0);
    const totals = {
        subtotal: subtotal,
        service_fee: 20000,
        total: subtotal + 20000
    };
    
    displayCartItems(items, totals);
}

/**
 * Display cart items in the UI
 */
function displayCartItems(items, totals) {
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const tableBody = document.getElementById('cartTableBody');
    
    if (!tableBody) return;
    
    emptyCart.style.display = 'none';
    cartContent.style.display = 'block';
    
    // Build table rows
    tableBody.innerHTML = items.map(item => `
        <tr data-cart-id="${item.cart_id}">
            <td>
                <div class="product-cell">
                    <div class="product-image">
                        <img src="${item.image_url}" alt="${item.item_name}" onerror="this.src='assets/menu/placeholder.jpg'">
                    </div>
                    <div class="product-info">
                        <h3>${item.item_name}</h3>
                        ${item.description ? `<p>${item.description}</p>` : ''}
                    </div>
                </div>
            </td>
            <td>
                <div class="portion-cell">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.cart_id}, ${item.quantity - 1})">−</button>
                        <span>(x${item.quantity})</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.cart_id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
            </td>
            <td class="price-cell">
                ${formatPrice(item.item_total)}
            </td>
            <td>
                <button class="remove-btn" onclick="removeFromCart(${item.cart_id})" title="Xóa món">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
    
    updateCartSummary(totals, items.length);
}

/**
 * Update cart summary totals
 */
function updateCartSummary(totals, itemCount) {
    const serviceFee = 20000;
    
    document.getElementById('subtotalAmount').textContent = formatPrice(totals.subtotal);
    document.getElementById('serviceFees').textContent = formatPrice(serviceFee);
    document.getElementById('totalAmount').textContent = formatPrice(totals.subtotal + serviceFee);
    document.getElementById('itemCount').textContent = itemCount;
}

/**
 * Show empty cart state
 */
function showEmptyCart() {
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    
    if (emptyCart && cartContent) {
        emptyCart.style.display = 'flex';
        cartContent.style.display = 'none';
    }
}

/**
 * Update cart item quantity
 */
function updateQuantity(cartId, newQuantity) {
    if (newQuantity < 1) {
        if (confirm('Bạn có muốn xóa món này khỏi giỏ hàng?')) {
            removeFromCart(cartId);
        }
        return;
    }
    
    const cart = getCartFromStorage();
    const itemIndex = cart.findIndex(item => item.cart_id === cartId);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity = newQuantity;
        saveCartToStorage(cart);
        loadCart();
        updateCartBadge();
    }
}

/**
 * Remove item from cart
 */
function removeFromCart(cartId) {
    const cart = getCartFromStorage();
    const filteredCart = cart.filter(item => item.cart_id !== cartId);
    
    saveCartToStorage(filteredCart);
    showNotification('Đã xóa món khỏi giỏ hàng', 'success');
    loadCart();
    updateCartBadge();
}

/**
 * Handle checkout
 */
function handleCheckout() {
    alert('Chức năng thanh toán đang được phát triển');
    // window.location.href = 'checkout.html';
}

/**
 * Format price in VND
 */
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                margin-left: 15px;
                padding: 0;
                line-height: 1;
            ">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Make functions globally accessible
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.updateCartBadge = updateCartBadge;
