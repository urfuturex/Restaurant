/**
 * Cart Management JavaScript
 * Handles cart operations and UI updates
 */

// API Base URL
const API_URL = 'api/cart.php';

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
 * Update cart badge count in header
 */
async function updateCartBadge() {
    try {
        const response = await fetch(`${API_URL}?action=count`);
        const data = await response.json();
        
        const badge = document.getElementById('cartBadge');
        if (badge && data.success) {
            badge.textContent = data.count;
            badge.style.display = data.count > 0 ? 'flex' : 'none';
        }
    } catch (error) {
        console.error('Error updating cart badge:', error);
    }
}

/**
 * Add item to cart
 */
async function addToCart(itemId, quantity = 1, specialInstructions = '') {
    try {
        const response = await fetch(`${API_URL}?action=add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                item_id: itemId,
                quantity: quantity,
                special_instructions: specialInstructions
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show success notification
            showNotification(data.message, 'success');
            updateCartBadge();
            
            // Close popup if it exists
            const popup = document.getElementById('menuPopup');
            if (popup) {
                popup.style.display = 'none';
            }
        } else {
            showNotification(data.message, 'error');
        }
        
        return data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
    }
}

/**
 * Load and display cart items
 */
async function loadCart() {
    try {
        const response = await fetch(`${API_URL}?action=get`);
        const data = await response.json();
        
        if (data.success) {
            displayCartItems(data.items, data.totals);
        } else {
            showEmptyCart();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        showNotification('Không thể tải giỏ hàng', 'error');
    }
}

/**
 * Display cart items in the UI
 */
function displayCartItems(items, totals) {
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const tableBody = document.getElementById('cartTableBody');
    
    if (items.length === 0) {
        showEmptyCart();
        return;
    }
    
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
                        ${item.description ? `<p>${item.description.substring(0, 50)}...</p>` : ''}
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
    // Calculate service fee (20,000 VND flat rate)
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
 * Handle checkout
 */
function handleCheckout() {
    // Navigate to checkout page
    window.location.href = 'checkout.html';
}

/**
 * Update cart item quantity
 */
async function updateQuantity(cartId, newQuantity) {
    if (newQuantity < 1) {
        if (confirm('Bạn có muốn xóa món này khỏi giỏ hàng?')) {
            removeFromCart(cartId);
        }
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}?action=update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cart_id: cartId,
                quantity: newQuantity
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadCart();
            updateCartBadge();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        showNotification('Có lỗi xảy ra', 'error');
    }
}

/**
 * Remove item from cart
 */
async function removeFromCart(cartId) {
    try {
        const response = await fetch(`${API_URL}?action=remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cart_id: cartId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(data.message, 'success');
            loadCart();
            updateCartBadge();
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification('Có lỗi xảy ra', 'error');
    }
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
 * Handle checkout
 */
function handleCheckout() {
    // Navigate to checkout page
    window.location.href = 'checkout.html';
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
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Make functions globally accessible
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.updateCartBadge = updateCartBadge;
