/**
 * Profile Page JavaScript
 * Handles user profile viewing and editing
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Load user data
    loadUserProfile();
    
    // Tab switching
    setupTabs();
    
    // Form handlers
    setupProfileForm();
    setupPasswordForm();
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', () => {
        window.location.href = 'menu.html';
    });
    
    // Avatar upload
    setupAvatarUpload();
    
    // Check if on history tab initially
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab && activeTab.dataset.tab === 'history') {
        setTimeout(function() {
            loadOrderHistoryData();
        }, 100);
    }
});

/**
 * Load user profile from API
 */
async function loadUserProfile() {
    const user = getCurrentUser();
    
    try {
        const response = await fetch(`api/get-profile.php?user_id=${user.id}`);
        const data = await response.json();
        
        if (data.success) {
            displayUserProfile(data.user);
        } else {
            // Use localStorage data as fallback
            displayUserProfile(user);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        // Use localStorage data as fallback
        displayUserProfile(user);
    }
}

/**
 * Display user profile data
 */
function displayUserProfile(userData) {
    document.getElementById('userName').textContent = userData.name || userData.full_name || 'User';
    document.getElementById('fullName').value = userData.name || userData.full_name || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('phone').value = userData.phone || '';
    document.getElementById('address').value = userData.address || '';
    document.getElementById('note').value = userData.note || '';
    
    // Set avatar if available
    if (userData.avatar) {
        document.getElementById('userAvatar').src = userData.avatar;
    }
}

/**
 * Setup tab switching
 */
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
            
            // Load order history when history tab is clicked
            if (tabName === 'history') {
                setTimeout(function() {
                    loadOrderHistoryData();
                }, 100);
            }
        });
    });
}

/**
 * Setup profile form submission
 */
function setupProfileForm() {
    const form = document.getElementById('profileForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = getCurrentUser();
        const formData = {
            user_id: user.id,
            full_name: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            note: document.getElementById('note').value.trim()
        };
        
        // Disable submit button
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'ĐANG LƯU...';
        
        try {
            const response = await fetch('api/update-profile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('Cập nhật thông tin thành công!', 'success');
                
                // Update localStorage
                const updatedUser = {
                    ...user,
                    name: formData.full_name,
                    phone: formData.phone,
                    address: formData.address
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                // Update display
                document.getElementById('userName').textContent = formData.full_name;
            } else {
                showNotification(data.message || 'Cập nhật thất bại', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification('Lỗi kết nối. Vui lòng thử lại!', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'LƯU';
        }
    });
}

/**
 * Setup password form submission
 */
function setupPasswordForm() {
    const form = document.getElementById('passwordForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showNotification('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showNotification('Mật khẩu xác nhận không khớp', 'error');
            return;
        }
        
        const user = getCurrentUser();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'ĐANG XỬ LÝ...';
        
        try {
            const response = await fetch('api/change-password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.id,
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('Đổi mật khẩu thành công!', 'success');
                form.reset();
            } else {
                showNotification(data.message || 'Đổi mật khẩu thất bại', 'error');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            showNotification('Lỗi kết nối. Vui lòng thử lại!', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ĐỔI MẬT KHẨU';
        }
    });
}

/**
 * Handle logout
 */
function handleLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('user');
        showNotification('Đã đăng xuất!', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.profile-notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `profile-notification profile-notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 350px;
        font-family: 'Lora', serif;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                padding: 0;
                opacity: 0.8;
            ">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Setup avatar upload functionality
 */
function setupAvatarUpload() {
    const uploadBtn = document.getElementById('uploadAvatarBtn');
    const avatarImg = document.getElementById('userAvatar');
    
    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Click handler for upload button
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Vui lòng chọn file ảnh', 'error');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Kích thước ảnh phải nhỏ hơn 5MB', 'error');
            return;
        }
        
        // Preview image immediately
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Upload to server
        await uploadAvatar(file);
    });
}

/**
 * Upload avatar to server
 */
async function uploadAvatar(file) {
    const user = getCurrentUser();
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('user_id', user.id);
    
    try {
        const response = await fetch('api/upload-avatar.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Cập nhật ảnh đại diện thành công!', 'success');
            
            // Update localStorage
            const updatedUser = {
                ...user,
                avatar: data.avatar_url
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
            showNotification(data.message || 'Upload ảnh thất bại', 'error');
        }
    } catch (error) {
        console.error('Error uploading avatar:', error);
        showNotification('Lỗi khi upload ảnh', 'error');
    }
}

/**
 * Load order history
 */
function loadOrderHistoryData() {
    try {
        const orderHistory = localStorage.getItem('orderHistory');
        
        console.log('Loading order history:', orderHistory); // Debug
        
        if (!orderHistory) {
            console.log('No order history found'); // Debug
            showEmptyState();
            return;
        }
        
        const orders = JSON.parse(orderHistory);
        
        console.log('Parsed orders:', orders); // Debug
        
        if (orders.length === 0) {
            console.log('Orders array is empty'); // Debug
            showEmptyState();
            return;
        }
        
        // Get unique dates from orders
        const dates = getUniqueDates(orders);
        
        console.log('Unique dates:', dates); // Debug
        
        // Render date slider
        renderDateSlider(dates, orders);
        
        // Setup date navigation
        setupDateNavigation();
        
        // Show orders for first date
        if (dates.length > 0) {
            filterOrdersByDate(dates[0], orders);
        }
        
    } catch (error) {
        console.error('Error loading order history:', error);
        showEmptyState();
    }
}

/**
 * Get unique dates from orders
 */
function getUniqueDates(orders) {
    const dateMap = new Map();
    
    orders.forEach(order => {
        const date = new Date(order.date);
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, date);
        }
    });
    
    // Sort dates in descending order (newest first)
    return Array.from(dateMap.values()).sort((a, b) => b - a);
}

/**
 * Render date slider
 */
function renderDateSlider(dates, orders) {
    const dateSlider = document.getElementById('dateSlider');
    dateSlider.innerHTML = '';
    
    dates.forEach((date, index) => {
        const dateItem = document.createElement('div');
        dateItem.className = 'date-item' + (index === 0 ? ' active' : '');
        dateItem.dataset.date = date.toISOString();
        
        const day = date.getDate();
        const month = date.getMonth() + 1;
        
        dateItem.innerHTML = `
            <span class="date-day">${day}</span>
            <span class="date-month">${month}/3</span>
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
 * Setup date navigation buttons
 */
function setupDateNavigation() {
    const slider = document.getElementById('dateSlider');
    const prevBtn = document.getElementById('datePrevBtn');
    const nextBtn = document.getElementById('dateNextBtn');
    
    prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -200, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: 200, behavior: 'smooth' });
    });
}

/**
 * Filter orders by date
 */
function filterOrdersByDate(targetDate, allOrders) {
    const targetDateKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
    
    const filteredOrders = allOrders.filter(order => {
        const orderDate = new Date(order.date);
        const orderDateKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;
        return orderDateKey === targetDateKey;
    });
    
    renderOrderCards(filteredOrders);
}

/**
 * Render order cards
 */
function renderOrderCards(orders) {
    const container = document.getElementById('orderCardsContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (orders.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    emptyState.style.display = 'none';
    container.innerHTML = '';
    
    // Sort by time (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    orders.forEach(order => {
        const card = createOrderCard(order);
        container.appendChild(card);
    });
}

/**
 * Create order card element
 */
function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    
    const orderDate = new Date(order.date);
    const time = `${String(orderDate.getHours()).padStart(2, '0')}:${String(orderDate.getMinutes()).padStart(2, '0')}`;
    
    // Create items table HTML
    let itemsHTML = '';
    order.items.forEach(item => {
        itemsHTML += `
            <tr>
                <td>
                    <div class="order-item-name-cell">
                        <span class="order-item-name">${item.name}</span>
                    </div>
                </td>
                <td>(x${item.quantity})</td>
                <td>${formatPrice(item.total_price)}</td>
            </tr>
        `;
    });
    
    card.innerHTML = `
        <div class="order-card-header">
            <div class="order-time">${time}</div>
            <div class="order-actions">
                <button class="btn-order-action btn-detail" onclick="viewOrderDetail('${order.orderId}')">
                    Đặt lại
                </button>
                <button class="btn-order-action btn-delete" onclick="deleteOrder('${order.orderId}')">
                    Xóa
                </button>
            </div>
        </div>
        
        <table class="order-items-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Portion</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>
        
        <div class="order-summary">
            <div class="order-summary-row">
                <span class="order-summary-label">Subtotal</span>
                <span class="order-summary-value">${formatPrice(order.subtotal)}</span>
            </div>
            <div class="order-summary-row">
                <span class="order-summary-label">Service Fees</span>
                <span class="order-summary-value">${formatPrice(order.serviceFee)}</span>
            </div>
            <div class="order-summary-row total">
                <span class="order-summary-label">Total VND (${order.items.reduce((sum, item) => sum + item.quantity, 0)} item)</span>
                <span class="order-summary-value">${formatPrice(order.total)}</span>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Format price
 */
function formatPrice(price) {
    const numPrice = parseFloat(price) || 0;
    return numPrice.toLocaleString('vi-VN') + ' đ';
}

/**
 * Show empty state
 */
function showEmptyState() {
    const container = document.getElementById('orderCardsContainer');
    const emptyState = document.getElementById('emptyState');
    const dateSlider = document.querySelector('.date-slider-container');
    
    console.log('Showing empty state'); // Debug
    console.log('Container:', container); // Debug
    console.log('Empty state:', emptyState); // Debug
    console.log('Date slider:', dateSlider); // Debug
    
    if (container) container.style.display = 'none';
    if (emptyState) {
        emptyState.style.display = 'block';
        emptyState.innerHTML = '<p>Bạn chưa có đơn hàng nào</p>';
    }
    if (dateSlider) dateSlider.style.display = 'none';
}

/**
 * Backwards-compatible wrapper: load order history
 */
function loadOrderHistory() {
    // Delegate to the main loader
    try {
        if (typeof loadOrderHistoryData === 'function') {
            loadOrderHistoryData();
        } else {
            console.warn('loadOrderHistoryData not defined');
        }
    } catch (e) {
        console.error('Error calling loadOrderHistory:', e);
    }
}
/**
 * View order detail (reorder)
 */
window.viewOrderDetail = function(orderId) {
    try {
        const orderHistory = localStorage.getItem('orderHistory');
        if (!orderHistory) return;
        
        const orders = JSON.parse(orderHistory);
        const order = orders.find(o => o.orderId == orderId);
        
        if (!order) return;
        
        // Add items back to cart
        const cart = order.items.map(item => ({
            item_id: item.id,
            quantity: item.quantity
        }));
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Redirect to cart
        window.location.href = 'cart.html';
        
    } catch (error) {
        console.error('Error reordering:', error);
        alert('Có lỗi xảy ra khi đặt lại đơn hàng!');
    }
};

/**
 * Delete order
 */
window.deleteOrder = function(orderId) {
    if (!confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
        return;
    }
    
    try {
        const orderHistory = localStorage.getItem('orderHistory');
        if (!orderHistory) return;
        
        let orders = JSON.parse(orderHistory);
        orders = orders.filter(o => o.orderId != orderId);
        
        localStorage.setItem('orderHistory', JSON.stringify(orders));
        
        // Reload history
        loadOrderHistory();
        
        showNotification('Đã xóa đơn hàng', 'success');
        
    } catch (error) {
        console.error('Error deleting order:', error);
        alert('Có lỗi xảy ra khi xóa đơn hàng!');
    }
};

