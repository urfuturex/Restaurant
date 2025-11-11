/**
 * Authentication JavaScript
 * Handles login and registration
 */

// Registration Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!name || !email || !password) {
                showNotification('Vui lòng điền đầy đủ thông tin', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
                return;
            }
            
            // Disable submit button
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'ĐANG XỬ LÝ...';
            
            try {
                const response = await fetch('api/register.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
                    
                    // Redirect to login page after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    showNotification(data.message || 'Đăng ký thất bại', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'GET STARTED';
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('Lỗi kết nối. Vui lòng thử lại!', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'GET STARTED';
            }
        });
    }
    
    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!email || !password) {
                showNotification('Vui lòng nhập email và mật khẩu', 'error');
                return;
            }
            
            // Disable submit button
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'ĐANG ĐĂNG NHẬP...';
            
            try {
                const response = await fetch('api/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('Đăng nhập thành công! Đang chuyển hướng...', 'success');
                    
                    // Save user info to localStorage
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Redirect to menu after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = 'menu.html';
                    }, 1500);
                } else {
                    showNotification(data.message || 'Đăng nhập thất bại', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'LOGIN';
                }
            } catch (error) {
                console.error('Login error:', error);
                showNotification('Lỗi kết nối. Vui lòng thử lại!', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'LOGIN';
            }
        });
    }
    
    // Password Toggle
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            this.innerHTML = type === 'password' 
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
        });
    }
});

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.auth-notification');
    existing.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
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
        font-size: 15px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 15px;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                opacity: 0.8;
            ">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animation styles
if (!document.getElementById('auth-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'auth-notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}

/**
 * Get current user info
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Make functions globally accessible
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
