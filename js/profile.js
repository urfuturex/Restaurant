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
