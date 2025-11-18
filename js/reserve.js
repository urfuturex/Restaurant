/**
 * Reserve Page JavaScript
 * Handles restaurant search and booking
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const dateInput = document.getElementById('reserveDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    updateCartBadge();
});

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
 * Search restaurants based on form criteria
 */
function searchRestaurants() {
    const branch = document.getElementById('branchSelect').value;
    const guests = document.getElementById('guestCount').value;
    const date = document.getElementById('reserveDate').value;
    const time = document.getElementById('reserveTime').value;
    
    console.log('Searching with:', { branch, guests, date, time });
    
    // Store search criteria in sessionStorage
    sessionStorage.setItem('reserveSearch', JSON.stringify({
        branch,
        guests,
        date,
        time
    }));
    
    // Filter location cards based on branch
    const cards = document.querySelectorAll('.location-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        if (!branch || branch === '') {
            card.style.display = 'grid';
            visibleCount++;
        } else {
            // You can add data-branch attribute to cards for filtering
            card.style.display = 'grid';
            visibleCount++;
        }
    });
    
    if (visibleCount > 0) {
        showNotification(`Tìm thấy ${visibleCount} nhà hàng phù hợp!`, 'success');
    } else {
        showNotification('Không tìm thấy nhà hàng phù hợp!', 'error');
    }
}

/**
 * Book a specific restaurant
 */
function bookRestaurant(restaurantId) {
    const branch = document.getElementById('branchSelect').value;
    const guests = document.getElementById('guestCount').value;
    const date = document.getElementById('reserveDate').value;
    const time = document.getElementById('reserveTime').value;
    
    if (!date || !time) {
        alert('Vui lòng chọn ngày và giờ đặt bàn!');
        return;
    }
    
    // Determine location name based on restaurantId
    const locationNames = {
        'hbt1': 'Số 1, Hai Bà Trưng, Hà Nội',
        'hbt2': 'Số 1, Hai Bà Trưng, Hà Nội',
        'hbt3': 'Số 1, Hai Bà Trưng, Hà Nội',
        'hbt4': 'Số 1, Hai Bà Trưng, Hà Nội'
    };
    
    // Store booking info
    const bookingInfo = {
        restaurantId,
        location: locationNames[restaurantId] || 'Số 1, Hai Bà Trưng, Hà Nội',
        guests,
        date,
        time,
        timestamp: Date.now()
    };
    
    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingInfo));
    
    // Redirect to booking form page
    window.location.href = 'booking-form.html';
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
