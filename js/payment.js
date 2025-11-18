/**
 * Payment Page JavaScript
 */

// Load order data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadOrderTotal();
    setupFormValidation();
    setupCardNumberFormatting();
    setupExpirationFormatting();
});

/**
 * Load order total from sessionStorage
 */
function loadOrderTotal() {
    const orderData = sessionStorage.getItem('orderData');
    if (orderData) {
        const order = JSON.parse(orderData);
        const totalElement = document.getElementById('totalAmount');
        if (totalElement && order.total) {
            totalElement.textContent = formatPrice(order.total);
        }
    }
}

/**
 * Format price to Vietnamese currency
 */
function formatPrice(price) {
    const numPrice = parseFloat(price) || 0;
    return numPrice.toLocaleString('vi-VN') + ' đ';
}

/**
 * Setup card number formatting (add spaces every 4 digits)
 */
function setupCardNumberFormatting() {
    const cardNumberInput = document.getElementById('cardNumber');
    
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
    
    cardNumberInput.addEventListener('keypress', function(e) {
        // Only allow numbers
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    });
}

/**
 * Setup expiration date formatting (MM/YY)
 */
function setupExpirationFormatting() {
    const expirationInput = document.getElementById('expirationDate');
    
    expirationInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
    });
    
    expirationInput.addEventListener('keypress', function(e) {
        // Only allow numbers
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    });
}

/**
 * Setup form validation
 */
function setupFormValidation() {
    const form = document.getElementById('paymentForm');
    const cvvInput = document.getElementById('cvv');
    
    // CVV validation - only numbers
    cvvInput.addEventListener('keypress', function(e) {
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    });
    
    form.addEventListener('submit', handlePaymentSubmit);
}

/**
 * Handle payment form submission
 */
function handlePaymentSubmit(event) {
    event.preventDefault();
    
    const formData = {
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
        cardNumber: document.getElementById('cardNumber').value,
        expirationDate: document.getElementById('expirationDate').value,
        cvv: document.getElementById('cvv').value,
        cardName: document.getElementById('cardName').value,
        discountCode: document.getElementById('discountCode').value,
        agreeTerms: document.getElementById('agreeTerms').checked
    };
    
    // Validate card number (should have 16 digits)
    const cardDigits = formData.cardNumber.replace(/\s/g, '');
    if (cardDigits.length !== 16) {
        alert('Số thẻ phải có 16 chữ số!');
        return;
    }
    
    // Validate expiration date
    const expMatch = formData.expirationDate.match(/^(\d{2})\/(\d{2})$/);
    if (!expMatch) {
        alert('Ngày hết hạn không đúng định dạng MM/YY!');
        return;
    }
    
    const month = parseInt(expMatch[1]);
    const year = parseInt(expMatch[2]);
    
    if (month < 1 || month > 12) {
        alert('Tháng không hợp lệ!');
        return;
    }
    
    // Check if card is expired
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        alert('Thẻ đã hết hạn!');
        return;
    }
    
    // Validate CVV
    if (formData.cvv.length !== 3) {
        alert('CVV phải có 3 chữ số!');
        return;
    }
    
    // Validate terms agreement
    if (!formData.agreeTerms) {
        alert('Vui lòng đồng ý với điều khoản để tiếp tục!');
        return;
    }
    
    // Get order data
    const orderData = sessionStorage.getItem('orderData');
    if (!orderData) {
        alert('Không tìm thấy thông tin đơn hàng!');
        return;
    }
    
    // Merge payment info with order data
    const completeOrder = {
        ...JSON.parse(orderData),
        orderId: Date.now(),
        payment: {
            method: formData.paymentMethod,
            cardLast4: cardDigits.slice(-4),
            cardName: formData.cardName,
            discountCode: formData.discountCode || null
        },
        status: 'paid',
        paidAt: new Date().toISOString()
    };
    
    // Save to sessionStorage for confirmation page
    sessionStorage.setItem('completedOrder', JSON.stringify(completeOrder));
    
    // Show loading
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Đang xử lý...';
    submitBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    }, 1500);
}
