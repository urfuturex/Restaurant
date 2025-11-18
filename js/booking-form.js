/**
 * Booking Form JavaScript
 * Handles booking form submission and timer
 */

let countdownTimer;
let timeRemaining = 4835; // 80 minutes 35 seconds

document.addEventListener('DOMContentLoaded', function() {
    loadBookingInfo();
    updateCartBadge();
    startCountdown();
    loadUserInfo();
});

/**
 * Load booking information from sessionStorage
 */
function loadBookingInfo() {
    const bookingInfo = sessionStorage.getItem('pendingBooking');
    
    if (bookingInfo) {
        const booking = JSON.parse(bookingInfo);
        
        // Update summary display
        if (booking.location) {
            document.getElementById('bookingLocation').textContent = booking.location;
        }
        
        if (booking.guests) {
            document.getElementById('bookingGuests').textContent = booking.guests + ' người';
            document.getElementById('numberOfGuests').value = booking.guests;
        }
        
        if (booking.date && booking.time) {
            const dateObj = new Date(booking.date + 'T' + booking.time);
            const formattedDate = formatDateTime(dateObj);
            document.getElementById('bookingDateTime').textContent = formattedDate;
        }
    }
}

/**
 * Format date and time
 */
function formatDateTime(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    
    return `${day}/${month}/${year}, ${displayHours}:${minutes} ${period}`;
}

/**
 * Load user info and auto-fill form
 */
function loadUserInfo() {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            
            // Auto-fill name
            const nameInput = document.getElementById('customerName');
            if (nameInput && user.name) {
                nameInput.value = user.name;
            }
            
            // Auto-fill phone
            const phoneInput = document.getElementById('contactPhone');
            if (phoneInput && user.phone) {
                phoneInput.value = user.phone;
            }
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

/**
 * Start countdown timer
 */
function startCountdown() {
    updateTimerDisplay();
    
    countdownTimer = setInterval(() => {
        timeRemaining--;
        
        if (timeRemaining <= 0) {
            clearInterval(countdownTimer);
            handleTimeout();
        } else {
            updateTimerDisplay();
        }
    }, 1000);
}

/**
 * Update timer display
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')} s`;
    
    const timerElement = document.getElementById('timeRemaining');
    if (timerElement) {
        timerElement.textContent = display;
        
        // Change color if time is running out
        if (timeRemaining < 300) { // Less than 5 minutes
            timerElement.style.color = '#d32f2f';
        }
    }
}

/**
 * Handle timeout
 */
function handleTimeout() {
    alert('Thời gian giữ chỗ đã hết! Vui lòng đặt bàn lại.');
    window.location.href = 'reserve.html';
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

/**
 * Handle booking form submission
 */
async function handleBookingSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('customerName').value,
        numberOfGuests: document.getElementById('numberOfGuests').value,
        guestsOver60: document.getElementById('guestsOver60').value,
        guestsUnder3: document.getElementById('guestsUnder3').value,
        contact: document.getElementById('contactPhone').value,
        note: document.getElementById('noteForRestaurant').value
    };
    
    // Get booking info from session
    const bookingInfo = sessionStorage.getItem('pendingBooking');
    let booking = bookingInfo ? JSON.parse(bookingInfo) : {};
    
    // Merge with form data
    booking = { 
        ...booking, 
        ...formData,
        table: 'B4', // Assign table
        bookingId: Date.now(),
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
        if (confirm('Bạn cần đăng nhập để hoàn tất đặt bàn. Chuyển đến trang đăng nhập?')) {
            sessionStorage.setItem('bookingData', JSON.stringify(booking));
            window.location.href = 'login.html';
        }
        return;
    }
    
    // Stop timer
    clearInterval(countdownTimer);
    
    try {
        // Save to database via API
        // TODO: Uncomment when API is ready
        // const response = await fetch('api/bookings.php?action=create', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(booking)
        // });
        // const data = await response.json();
        
        // For now, save to localStorage
        saveBookingToStorage(booking);
        
        // Save to session for success page
        sessionStorage.setItem('completedBooking', JSON.stringify(booking));
        
        // Clear pending booking
        sessionStorage.removeItem('pendingBooking');
        sessionStorage.removeItem('bookingData');
        
        // Redirect to success page
        window.location.href = 'booking-success.html';
        
    } catch (error) {
        console.error('Error saving booking:', error);
        alert('Có lỗi xảy ra khi lưu đặt bàn. Vui lòng thử lại!');
    }
}

/**
 * Save booking to localStorage
 */
function saveBookingToStorage(booking) {
    try {
        let bookings = localStorage.getItem('bookingHistory');
        bookings = bookings ? JSON.parse(bookings) : [];
        
        // Add new booking at the beginning
        bookings.unshift(booking);
        
        // Keep only last 50 bookings
        if (bookings.length > 50) {
            bookings = bookings.slice(0, 50);
        }
        
        localStorage.setItem('bookingHistory', JSON.stringify(bookings));
    } catch (error) {
        console.error('Error saving booking to storage:', error);
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }
});
