/**
 * Admin Orders Management JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    if (!isAdminLoggedIn()) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Load orders
    loadAdminOrders();
    
    // Setup date navigation
    setupOrderDateNavigation();
});

/**
 * Check if admin is logged in
 */
function isAdminLoggedIn() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    return isLoggedIn === 'true';
}

/**
 * Handle admin logout
 */
window.handleAdminLogout = function() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminLoginTime');
        window.location.href = 'login.html';
    }
};

/**
 * Load admin orders
 */
function loadAdminOrders() {
    try {
        // Load from localStorage orderHistory
        const orderHistory = localStorage.getItem('orderHistory');
        
        console.log('Loading orders for admin:', orderHistory);
        
        if (!orderHistory) {
            showOrderEmptyState();
            return;
        }
        
        const orders = JSON.parse(orderHistory);
        
        if (orders.length === 0) {
            showOrderEmptyState();
            return;
        }
        
        // Get unique dates
        const dates = getUniqueOrderDates(orders);
        
        // Render date slider
        renderOrderDateSlider(dates, orders);
        
        // Show orders for first date
        if (dates.length > 0) {
            filterOrdersByDate(dates[0], orders);
        }
        
    } catch (error) {
        console.error('Error loading admin orders:', error);
        showOrderEmptyState();
    }
}

/**
 * Get unique dates from orders
 */
function getUniqueOrderDates(orders) {
    const dateMap = new Map();
    
    orders.forEach(order => {
        const dateStr = order.paidAt || order.date;
        const date = new Date(dateStr);
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, date);
        }
    });
    
    // Sort dates in descending order (newest first)
    return Array.from(dateMap.values()).sort((a, b) => b - a);
}

/**
 * Render order date slider
 */
function renderOrderDateSlider(dates, orders) {
    const dateSlider = document.getElementById('orderDateSlider');
    dateSlider.innerHTML = '';
    
    dates.forEach((date, index) => {
        const dateItem = document.createElement('div');
        dateItem.className = 'date-item' + (index === 0 ? ' active' : '');
        dateItem.dataset.date = date.toISOString();
        
        const day = date.getDate();
        const month = date.getMonth() + 1;
        
        dateItem.innerHTML = `
            <span class="date-day">${day}</span>
            <span class="date-month">${month}/4</span>
        `;
        
        dateItem.addEventListener('click', () => {
            // Remove active from all
            document.querySelectorAll('.date-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active to clicked
            dateItem.classList.add('active');
            
            // Filter orders by date
            filterOrdersByDate(date, orders);
        });
        
        dateSlider.appendChild(dateItem);
    });
}

/**
 * Setup date navigation
 */
function setupOrderDateNavigation() {
    const slider = document.getElementById('orderDateSlider');
    const prevBtn = document.getElementById('orderDatePrevBtn');
    const nextBtn = document.getElementById('orderDateNextBtn');
    
    if (prevBtn && slider) {
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -200, behavior: 'smooth' });
        });
    }
    
    if (nextBtn && slider) {
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 200, behavior: 'smooth' });
        });
    }
}

/**
 * Filter orders by date
 */
function filterOrdersByDate(targetDate, allOrders) {
    const targetDateKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
    
    const filteredOrders = allOrders.filter(order => {
        const orderDateStr = order.paidAt || order.date;
        const orderDate = new Date(orderDateStr);
        const orderDateKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;
        return orderDateKey === targetDateKey;
    });
    
    renderAdminOrderCards(filteredOrders);
}

/**
 * Render admin order cards
 */
function renderAdminOrderCards(orders) {
    const container = document.getElementById('adminOrderCards');
    const emptyState = document.getElementById('orderEmptyState');
    
    if (orders.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    emptyState.style.display = 'none';
    container.innerHTML = '';
    
    // Sort by time
    orders.sort((a, b) => {
        const dateA = new Date(a.paidAt || a.date);
        const dateB = new Date(b.paidAt || b.date);
        return dateB - dateA;
    });
    
    // Group orders by number (1, 2, 3...)
    orders.forEach((order, index) => {
        const card = createAdminOrderCard(order, orders.length - index);
        container.appendChild(card);
    });
}

/**
 * Create admin order card
 */
function createAdminOrderCard(order, orderNumber) {
    const card = document.createElement('div');
    card.className = 'admin-order-card';
    card.dataset.orderId = order.orderId;
    
    const orderDate = new Date(order.paidAt || order.date);
    const time = `${String(orderDate.getHours()).padStart(2, '0')}:${String(orderDate.getMinutes()).padStart(2, '0')}`;
    
    // Create items table HTML with images
    let itemsHTML = '';
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            itemsHTML += `
                <tr>
                    <td>
                        <div class="order-item-with-image">
                            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="order-item-img">` : ''}
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td>(x${item.quantity})</td>
                    <td>${formatPrice(item.total_price || (item.price * item.quantity))}</td>
                </tr>
            `;
        });
    }
    
    card.innerHTML = `
        <div class="order-card-header">
            <div class="order-number-time">
                <span class="order-number">${orderNumber}.</span>
                <span class="order-time">${time}</span>
            </div>
            <div class="order-actions">
                <button class="btn-order-action btn-accept" onclick="acceptOrder('${order.orderId}')">
                    Nhận
                </button>
                <button class="btn-order-action btn-reject" onclick="rejectOrder('${order.orderId}')">
                    Từ chối
                </button>
            </div>
        </div>
        
        <div class="order-details">
            <div class="order-customer-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span class="customer-name editable-span" contenteditable="true" 
                      onblur="updateOrderField('${order.orderId}', 'customerName', this.textContent)">
                    ${order.customer?.fullName || 'N/A'}
                </span>
            </div>
            
            <table class="order-items-table">
                <thead>
                    <tr>
                        <th>Product name</th>
                        <th>Portion</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
            
            <div class="order-summary-box">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>${formatPrice(order.subtotal)}</span>
                </div>
                <div class="summary-row">
                    <span>Service Fees</span>
                    <span>${formatPrice(order.serviceFee)}</span>
                </div>
                <div class="summary-row total-row">
                    <span>Total (x${order.totalItems || order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0})</span>
                    <span>${formatPrice(order.total)}</span>
                </div>
            </div>
            
            ${order.note ? `
                <div class="order-note-box">
                    <strong>Note:</strong>
                    <p contenteditable="true" onblur="updateOrderField('${order.orderId}', 'note', this.textContent)">${order.note}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

/**
 * Update order field
 */
window.updateOrderField = function(orderId, field, value) {
    try {
        const orderHistory = localStorage.getItem('orderHistory');
        if (!orderHistory) return;
        
        let orders = JSON.parse(orderHistory);
        const orderIndex = orders.findIndex(o => o.orderId == orderId);
        
        if (orderIndex === -1) return;
        
        // Update field
        if (field === 'customerName') {
            if (!orders[orderIndex].customer) {
                orders[orderIndex].customer = {};
            }
            orders[orderIndex].customer.fullName = value;
        } else {
            orders[orderIndex][field] = value;
        }
        
        // Save back to localStorage
        localStorage.setItem('orderHistory', JSON.stringify(orders));
        
        console.log(`Updated order ${orderId}: ${field} = ${value}`);
        
        // TODO: Update to database
        
    } catch (error) {
        console.error('Error updating order field:', error);
    }
};

/**
 * Accept order
 */
window.acceptOrder = function(orderId) {
    if (!confirm('Xác nhận nhận đơn hàng này?')) return;
    
    updateOrderField(orderId, 'status', 'accepted');
    showOrderNotification('Đã nhận đơn hàng', 'success');
    
    // Reload orders
    setTimeout(() => {
        loadAdminOrders();
    }, 500);
};

/**
 * Reject order
 */
window.rejectOrder = function(orderId) {
    if (!confirm('Xác nhận từ chối đơn hàng này?')) return;
    
    try {
        const orderHistory = localStorage.getItem('orderHistory');
        if (!orderHistory) return;
        
        let orders = JSON.parse(orderHistory);
        orders = orders.filter(o => o.orderId != orderId);
        
        localStorage.setItem('orderHistory', JSON.stringify(orders));
        
        showOrderNotification('Đã xóa đơn hàng', 'success');
        
        // Reload orders
        loadAdminOrders();
        
    } catch (error) {
        console.error('Error rejecting order:', error);
        showOrderNotification('Có lỗi xảy ra', 'error');
    }
};

/**
 * Format price
 */
function formatPrice(price) {
    const numPrice = parseFloat(price) || 0;
    return numPrice.toLocaleString('vi-VN') + 'đ';
}

/**
 * Show order empty state
 */
function showOrderEmptyState() {
    const container = document.getElementById('adminOrderCards');
    const emptyState = document.getElementById('orderEmptyState');
    const dateSlider = document.querySelector('.date-slider-container');
    
    if (container) container.style.display = 'none';
    if (emptyState) {
        emptyState.style.display = 'block';
        emptyState.innerHTML = '<p>Chưa có đơn hàng nào</p>';
    }
    if (dateSlider) dateSlider.style.display = 'none';
}

/**
 * Show order notification
 */
function showOrderNotification(message, type = 'info') {
    const existing = document.querySelectorAll('.admin-notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-family: 'Lora', serif;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
