/**
 * Confirmation Page JavaScript
 */

// Load order data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadOrderDetails();
    clearCart();
});

/**
 * Load order details from sessionStorage
 */
function loadOrderDetails() {
    const completedOrder = sessionStorage.getItem('completedOrder');
    
    if (!completedOrder) {
        // No order data, redirect to menu
        alert('Không tìm thấy thông tin đơn hàng!');
        window.location.href = 'menu.html';
        return;
    }
    
    try {
        const order = JSON.parse(completedOrder);
        displayOrderItems(order.items);
        
        // Save order to localStorage for order history
        saveOrderToHistory(order);
        
    } catch (error) {
        console.error('Error loading order details:', error);
        alert('Có lỗi xảy ra khi tải thông tin đơn hàng!');
    }
}

/**
 * Display order items in table
 */
function displayOrderItems(items) {
    const tbody = document.getElementById('orderItemsBody');
    
    if (!tbody || !items || items.length === 0) {
        return;
    }
    
    tbody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        
        // Product Name
        const nameCell = document.createElement('td');
        nameCell.innerHTML = `
            <div class="order-item-name">
                <span>${item.name}</span>
            </div>
        `;
        
        // Portion (Quantity)
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
}

/**
 * Format price to Vietnamese currency
 */
function formatPrice(price) {
    const numPrice = parseFloat(price) || 0;
    return numPrice.toLocaleString('vi-VN') + ' đ';
}

/**
 * Save order to localStorage for history
 */
function saveOrderToHistory(order) {
    try {
        console.log('Saving order to history:', order); // Debug
        
        let orderHistory = localStorage.getItem('orderHistory');
        orderHistory = orderHistory ? JSON.parse(orderHistory) : [];
        
        console.log('Current order history:', orderHistory); // Debug
        
        // Create order history entry
        const historyEntry = {
            orderId: order.orderId || Date.now(),
            date: order.paidAt || new Date().toISOString(),
            items: order.items,
            customer: order.customer,
            payment: order.payment,
            total: order.total,
            subtotal: order.subtotal,
            serviceFee: order.serviceFee,
            status: 'completed'
        };
        
        console.log('History entry to save:', historyEntry); // Debug
        
        // Add to beginning of array
        orderHistory.unshift(historyEntry);
        
        // Keep only last 50 orders
        if (orderHistory.length > 50) {
            orderHistory = orderHistory.slice(0, 50);
        }
        
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        
        console.log('Order history saved successfully'); // Debug
        console.log('Total orders in history:', orderHistory.length); // Debug
        
        // TODO: Send to API to save in database
        // fetch('api/orders.php?action=create', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(historyEntry)
        // });
        
    } catch (error) {
        console.error('Error saving order to history:', error);
    }
}

/**
 * Clear cart after successful order
 */
function clearCart() {
    try {
        // Clear localStorage cart
        localStorage.removeItem('cart');
        
        // Update cart badge
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = '0';
            badge.style.display = 'none';
        }
        
        // Clear sessionStorage order data after a delay
        // Keep it for a while in case user refreshes page
        setTimeout(() => {
            sessionStorage.removeItem('orderData');
            sessionStorage.removeItem('completedOrder');
        }, 5000);
        
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
}
