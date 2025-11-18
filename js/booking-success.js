/**
 * Booking Success Page JavaScript
 * Handles displaying booking info and history
 */

document.addEventListener('DOMContentLoaded', function() {
    loadCurrentBooking();
    loadBookingHistory();
    updateCartBadge();
});

/**
 * Load current booking information
 */
function loadCurrentBooking() {
    // Get from sessionStorage (just saved)
    const currentBooking = sessionStorage.getItem('completedBooking');
    
    if (currentBooking) {
        const booking = JSON.parse(currentBooking);
        displayCurrentBooking(booking);
    } else {
        // Try to get from localStorage as backup
        const bookings = getBookingsFromStorage();
        if (bookings && bookings.length > 0) {
            // Show the most recent one
            displayCurrentBooking(bookings[0]);
        }
    }
}

/**
 * Display current booking in table
 */
function displayCurrentBooking(booking) {
    const tbody = document.getElementById('currentBookingInfo');
    if (!tbody) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${booking.name || 'N/A'}</td>
        <td>${booking.numberOfGuests || '0'}</td>
        <td>${booking.table || 'B4'}</td>
        <td>+${booking.contact || '84012345678'}</td>
        <td>${formatDate(booking.date)}</td>
        <td>${booking.time || '19:30 pm'}</td>
    `;
    
    tbody.appendChild(row);
}

/**
 * Load booking history
 */
async function loadBookingHistory() {
    try {
        // First, try to load from API
        const user = localStorage.getItem('user');
        if (user) {
            // TODO: Call API to get booking history from database
            // const response = await fetch('api/bookings.php?action=history');
            // const data = await response.json();
            // if (data.success) {
            //     displayBookingHistory(data.bookings);
            //     return;
            // }
        }
        
        // Fallback to localStorage
        const bookings = getBookingsFromStorage();
        displayBookingHistory(bookings);
    } catch (error) {
        console.error('Error loading booking history:', error);
        // Show from localStorage as fallback
        const bookings = getBookingsFromStorage();
        displayBookingHistory(bookings);
    }
}

/**
 * Display booking history in table
 */
function displayBookingHistory(bookings) {
    const tbody = document.getElementById('bookingHistoryList');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!bookings || bookings.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" style="text-align: center; color: #999;">Chưa có lịch sử đặt bàn</td>';
        tbody.appendChild(row);
        return;
    }
    
    // Sort by date descending (newest first)
    bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(booking.date)}</td>
            <td>${booking.time || '19:30'}</td>
            <td>${booking.name || 'N/A'}</td>
            <td>${booking.numberOfGuests || '0'}</td>
            <td>${booking.table || 'A5, B4'}</td>
            <td>+${booking.contact || '84012345678'}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Get bookings from localStorage
 */
function getBookingsFromStorage() {
    try {
        const bookings = localStorage.getItem('bookingHistory');
        return bookings ? JSON.parse(bookings) : [];
    } catch (error) {
        console.error('Error getting bookings from storage:', error);
        return [];
    }
}

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    } catch (error) {
        return dateString;
    }
}

/**
 * Update cart badge count
 */
function updateCartBadge() {
    try {
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
    } catch (error) {
        console.error('Error updating cart badge:', error);
    }
}
