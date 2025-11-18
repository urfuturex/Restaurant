/**
 * Admin Bookings Management JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    if (!isAdminLoggedIn()) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Load bookings
    loadAdminBookings();
    
    // Setup date navigation
    setupAdminDateNavigation();
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
 * Load admin bookings
 */
function loadAdminBookings() {
    try {
        // Load from localStorage bookingHistory
        const bookingHistory = localStorage.getItem('bookingHistory');
        
        console.log('Loading bookings for admin:', bookingHistory);
        
        if (!bookingHistory) {
            showAdminEmptyState();
            return;
        }
        
        const bookings = JSON.parse(bookingHistory);
        
        if (bookings.length === 0) {
            showAdminEmptyState();
            return;
        }
        
        // Get unique dates
        const dates = getUniqueBookingDates(bookings);
        
        // Render date slider
        renderAdminDateSlider(dates, bookings);
        
        // Show bookings for first date
        if (dates.length > 0) {
            filterBookingsByDate(dates[0], bookings);
        }
        
    } catch (error) {
        console.error('Error loading admin bookings:', error);
        showAdminEmptyState();
    }
}

/**
 * Get unique dates from bookings
 */
function getUniqueBookingDates(bookings) {
    const dateMap = new Map();
    
    bookings.forEach(booking => {
        const dateStr = booking.date; // Format: "2025-11-17T19:30:00"
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
 * Render admin date slider
 */
function renderAdminDateSlider(dates, bookings) {
    const dateSlider = document.getElementById('adminDateSlider');
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
            
            // Filter bookings by date
            filterBookingsByDate(date, bookings);
        });
        
        dateSlider.appendChild(dateItem);
    });
}

/**
 * Setup date navigation
 */
function setupAdminDateNavigation() {
    const slider = document.getElementById('adminDateSlider');
    const prevBtn = document.getElementById('adminDatePrevBtn');
    const nextBtn = document.getElementById('adminDateNextBtn');
    
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
 * Filter bookings by date
 */
function filterBookingsByDate(targetDate, allBookings) {
    const targetDateKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;
    
    const filteredBookings = allBookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        const bookingDateKey = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}-${String(bookingDate.getDate()).padStart(2, '0')}`;
        return bookingDateKey === targetDateKey;
    });
    
    renderAdminBookingCards(filteredBookings);
}

/**
 * Render admin booking cards
 */
function renderAdminBookingCards(bookings) {
    const container = document.getElementById('adminBookingCards');
    const emptyState = document.getElementById('adminEmptyState');
    
    if (bookings.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    emptyState.style.display = 'none';
    container.innerHTML = '';
    
    // Sort by time
    bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    bookings.forEach(booking => {
        const card = createAdminBookingCard(booking);
        container.appendChild(card);
    });
}

/**
 * Create admin booking card
 */
function createAdminBookingCard(booking) {
    const card = document.createElement('div');
    card.className = 'admin-booking-card';
    card.dataset.bookingId = booking.bookingId;
    
    const bookingDate = new Date(booking.date);
    const time = `${String(bookingDate.getHours()).padStart(2, '0')}:${String(bookingDate.getMinutes()).padStart(2, '0')}`;
    
    card.innerHTML = `
        <div class="booking-card-header">
            <div class="booking-time">${time}</div>
            <div class="booking-actions">
                <button class="btn-booking-action btn-accept" onclick="acceptBooking('${booking.bookingId}')">
                    Nhận
                </button>
                <button class="btn-booking-action btn-reject" onclick="rejectBooking('${booking.bookingId}')">
                    Từ chối
                </button>
            </div>
        </div>
        
        <div class="booking-details">
            <table class="booking-info-table">
                <tr>
                    <th>Name</th>
                    <td>
                        <input type="text" class="editable-input" value="${booking.name || 'N/A'}" 
                               onchange="updateBookingField('${booking.bookingId}', 'name', this.value)">
                    </td>
                </tr>
                <tr>
                    <th>Number of guests</th>
                    <td>
                        <input type="number" class="editable-input" value="${booking.numberOfGuests || booking.guests || 2}" 
                               onchange="updateBookingField('${booking.bookingId}', 'numberOfGuests', this.value)">
                    </td>
                </tr>
                <tr>
                    <th>Bàn</th>
                    <td>
                        <input type="text" class="editable-input" value="${booking.table || 'B4'}" 
                               onchange="updateBookingField('${booking.bookingId}', 'table', this.value)">
                    </td>
                </tr>
                <tr>
                    <th>Liên hệ</th>
                    <td>
                        <input type="tel" class="editable-input" value="${booking.contact || booking.phoneNumber || 'N/A'}" 
                               onchange="updateBookingField('${booking.bookingId}', 'contact', this.value)">
                    </td>
                </tr>
                <tr>
                    <th>Ngày</th>
                    <td>${formatDate(booking.date)}</td>
                </tr>
                <tr>
                    <th>Giờ</th>
                    <td>${time}</td>
                </tr>
            </table>
            
            ${booking.note ? `
                <div class="booking-note">
                    <strong>Ghi chú:</strong>
                    <textarea class="editable-textarea" onchange="updateBookingField('${booking.bookingId}', 'note', this.value)">${booking.note}</textarea>
                </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

/**
 * Update booking field
 */
window.updateBookingField = function(bookingId, field, value) {
    try {
        const bookingHistory = localStorage.getItem('bookingHistory');
        if (!bookingHistory) return;
        
        let bookings = JSON.parse(bookingHistory);
        const bookingIndex = bookings.findIndex(b => b.bookingId == bookingId);
        
        if (bookingIndex === -1) return;
        
        // Update field
        bookings[bookingIndex][field] = value;
        
        // Save back to localStorage
        localStorage.setItem('bookingHistory', JSON.stringify(bookings));
        
        console.log(`Updated booking ${bookingId}: ${field} = ${value}`);
        
        // TODO: Update to database
        // fetch('api/bookings.php?action=update', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ bookingId, field, value })
        // });
        
    } catch (error) {
        console.error('Error updating booking field:', error);
    }
};

/**
 * Accept booking
 */
window.acceptBooking = function(bookingId) {
    if (!confirm('Xác nhận nhận đặt bàn này?')) return;
    
    updateBookingField(bookingId, 'status', 'accepted');
    showAdminNotification('Đã nhận đặt bàn', 'success');
    
    // Reload bookings
    setTimeout(() => {
        loadAdminBookings();
    }, 500);
};

/**
 * Reject booking
 */
window.rejectBooking = function(bookingId) {
    if (!confirm('Xác nhận từ chối đặt bàn này?')) return;
    
    try {
        const bookingHistory = localStorage.getItem('bookingHistory');
        if (!bookingHistory) return;
        
        let bookings = JSON.parse(bookingHistory);
        bookings = bookings.filter(b => b.bookingId != bookingId);
        
        localStorage.setItem('bookingHistory', JSON.stringify(bookings));
        
        showAdminNotification('Đã xóa đặt bàn', 'success');
        
        // Reload bookings
        loadAdminBookings();
        
    } catch (error) {
        console.error('Error rejecting booking:', error);
        showAdminNotification('Có lỗi xảy ra', 'error');
    }
};

/**
 * Format date
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

/**
 * Show admin empty state
 */
function showAdminEmptyState() {
    const container = document.getElementById('adminBookingCards');
    const emptyState = document.getElementById('adminEmptyState');
    const dateSlider = document.querySelector('.date-slider-container');
    
    if (container) container.style.display = 'none';
    if (emptyState) {
        emptyState.style.display = 'block';
        emptyState.innerHTML = '<p>Chưa có đặt bàn nào</p>';
    }
    if (dateSlider) dateSlider.style.display = 'none';
}

/**
 * Show admin notification
 */
function showAdminNotification(message, type = 'info') {
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
