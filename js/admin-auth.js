/**
 * Admin Authentication JavaScript
 */

const ADMIN_PASSWORD = '1111';

document.addEventListener('DOMContentLoaded', function() {
    // Password toggle
    const toggleBtn = document.getElementById('toggleAdminPassword');
    const passwordInput = document.getElementById('adminPassword');
    
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
        });
    }
    
    // Form submission
    const form = document.getElementById('adminLoginForm');
    if (form) {
        form.addEventListener('submit', handleAdminLogin);
    }
});

/**
 * Handle admin login
 */
function handleAdminLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        // Set admin session
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminLoginTime', new Date().toISOString());
        
        // Show success message
        showNotification('Đăng nhập thành công!', 'success');
        
        // Redirect to admin dashboard
        setTimeout(() => {
            window.location.href = 'admin-bookings.html';
        }, 1000);
    } else {
        showNotification('Mật khẩu không đúng!', 'error');
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
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
