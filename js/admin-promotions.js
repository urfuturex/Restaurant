// Check admin authentication
if (!sessionStorage.getItem('adminLoggedIn')) {
  window.location.href = 'admin-login.html';
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

// Global variables
let allCustomers = [];
let selectedCustomerId = null;

// Load all customers from localStorage
function loadAllCustomers() {
  const bookings = JSON.parse(localStorage.getItem('bookingHistory')) || [];
  const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
  const promotions = JSON.parse(localStorage.getItem('promotionHistory')) || [];
  
  const customerMap = new Map();
  
  // Add customers from bookings
  bookings.forEach(booking => {
    if (booking.name && booking.contact) {
      const key = booking.contact;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key,
          name: booking.name,
          contact: booking.contact,
          email: booking.email || '',
          source: 'booking',
          lastVisit: booking.date
        });
      }
    }
  });
  
  // Add customers from orders
  orders.forEach(order => {
    if (order.customerName && order.customerPhone) {
      const key = order.customerPhone;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key,
          name: order.customerName,
          contact: order.customerPhone,
          email: order.customerEmail || '',
          source: 'order',
          lastVisit: order.date
        });
      }
    }
  });
  
  // Add customers from promotions
  promotions.forEach(promo => {
    if (promo.customerName && promo.customerContact) {
      const key = promo.customerContact;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key,
          name: promo.customerName,
          contact: promo.customerContact,
          email: promo.customerEmail || '',
          source: 'promotion',
          lastVisit: promo.date
        });
      }
    }
  });
  
  allCustomers = Array.from(customerMap.values());
  console.log('Loaded customers:', allCustomers);
}

// Search and filter customers
function searchCustomers(query) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchTerm = query.toLowerCase().trim();
  return allCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm) ||
    customer.contact.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm)
  );
}

// Render customer dropdown
function renderCustomerDropdown(customers) {
  const dropdown = document.getElementById('customerDropdown');
  
  if (customers.length === 0) {
    dropdown.style.display = 'none';
    return;
  }
  
  dropdown.innerHTML = customers.map(customer => `
    <div class="customer-item" onclick="selectCustomer('${customer.id}')">
      <div class="customer-name">${customer.name}</div>
      <div class="customer-details">
        <span>${customer.contact}</span>
        ${customer.email ? `<span>${customer.email}</span>` : ''}
        <span class="customer-source">${customer.source === 'booking' ? 'Đặt bàn' : customer.source === 'order' ? 'Đơn hàng' : 'Ưu đãi'}</span>
      </div>
    </div>
  `).join('');
  
  dropdown.style.display = 'block';
}

// Select customer from dropdown
function selectCustomer(customerId) {
  const customer = allCustomers.find(c => c.id === customerId);
  if (!customer) return;
  
  selectedCustomerId = customerId;
  
  // Update selected customer display
  const selectedDiv = document.getElementById('selectedCustomer');
  selectedDiv.innerHTML = `
    <div class="selected-customer-card">
      <div class="customer-info">
        <strong>${customer.name}</strong>
        <span>${customer.contact}</span>
        ${customer.email ? `<span>${customer.email}</span>` : ''}
      </div>
      <button class="btn-remove" onclick="clearSelectedCustomer()">×</button>
    </div>
  `;
  selectedDiv.style.display = 'block';
  
  // Clear search input and hide dropdown
  document.getElementById('customerSearch').value = '';
  document.getElementById('customerDropdown').style.display = 'none';
}

// Clear selected customer
function clearSelectedCustomer() {
  selectedCustomerId = null;
  document.getElementById('selectedCustomer').style.display = 'none';
  document.getElementById('selectedCustomer').innerHTML = '';
}

// Send promotion
function sendPromotion() {
  if (!selectedCustomerId) {
    showNotification('Vui lòng chọn khách hàng', 'error');
    return;
  }
  
  const customer = allCustomers.find(c => c.id === selectedCustomerId);
  const discountAmount = document.getElementById('discountAmount').value;
  const discountType = document.getElementById('discountType').value;
  const validFrom = document.getElementById('validFrom').value;
  const validUntil = document.getElementById('validUntil').value;
  const note = document.getElementById('promotionNote').value;
  const message = document.getElementById('promotionMessage').value;
  
  if (!discountAmount || !validFrom || !validUntil) {
    showNotification('Vui lòng điền đầy đủ thông tin', 'error');
    return;
  }
  
  // Create promotion object
  const promotion = {
    id: Date.now().toString(),
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    customerContact: customer.contact,
    discountAmount: discountAmount,
    discountType: discountType,
    platform: validFrom,
    validUntil: validUntil,
    note: note,
    message: message,
    promotionName: `${discountAmount}${discountType === 'percent' ? '%' : 'đ'} OFF`,
    date: new Date().toLocaleDateString('vi-VN'),
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    status: 'sent'
  };
  
  // Save to localStorage
  const promotions = JSON.parse(localStorage.getItem('promotionHistory')) || [];
  promotions.unshift(promotion);
  localStorage.setItem('promotionHistory', JSON.stringify(promotions));
  
  showNotification('Đã gửi ưu đãi thành công!', 'success');
  
  // Reset form
  clearForm();
  
  // Reload history
  loadPromotionHistory();
}

// Save draft
function saveDraft() {
  if (!selectedCustomerId) {
    showNotification('Vui lòng chọn khách hàng', 'error');
    return;
  }
  
  const customer = allCustomers.find(c => c.id === selectedCustomerId);
  const discountAmount = document.getElementById('discountAmount').value;
  const discountType = document.getElementById('discountType').value;
  const validFrom = document.getElementById('validFrom').value;
  const validUntil = document.getElementById('validUntil').value;
  const note = document.getElementById('promotionNote').value;
  const message = document.getElementById('promotionMessage').value;
  
  // Create draft promotion object
  const promotion = {
    id: Date.now().toString(),
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    customerContact: customer.contact,
    discountAmount: discountAmount || '0',
    discountType: discountType,
    platform: validFrom || 'N/A',
    validUntil: validUntil || 'N/A',
    note: note,
    message: message,
    promotionName: `DRAFT - ${discountAmount || '0'}${discountType === 'percent' ? '%' : 'đ'} OFF`,
    date: new Date().toLocaleDateString('vi-VN'),
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    status: 'draft'
  };
  
  // Save to localStorage
  const promotions = JSON.parse(localStorage.getItem('promotionHistory')) || [];
  promotions.unshift(promotion);
  localStorage.setItem('promotionHistory', JSON.stringify(promotions));
  
  showNotification('Đã lưu nháp', 'success');
  
  // Reset form
  clearForm();
  
  // Reload history
  loadPromotionHistory();
}

// Clear form
function clearForm() {
  document.getElementById('discountAmount').value = '';
  document.getElementById('validFrom').value = '';
  document.getElementById('validUntil').value = '';
  document.getElementById('promotionNote').value = '';
  document.getElementById('promotionMessage').value = '';
  clearSelectedCustomer();
}

// Load promotion history
function loadPromotionHistory() {
  const promotions = JSON.parse(localStorage.getItem('promotionHistory')) || [];
  const tbody = document.getElementById('promotionHistoryBody');
  
  if (promotions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px; color: #999;">
          Chưa có ưu đãi nào được gửi
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = promotions.map(promo => `
    <tr class="${promo.status === 'draft' ? 'draft-row' : ''}">
      <td>${promo.date}</td>
      <td>${promo.customerName}</td>
      <td>${promo.customerEmail || 'N/A'}</td>
      <td>${promo.customerContact}</td>
      <td>
        <span class="promotion-badge ${promo.status === 'draft' ? 'badge-draft' : 'badge-sent'}">
          ${promo.promotionName}
        </span>
      </td>
    </tr>
  `).join('');
}

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  loadAllCustomers();
  loadPromotionHistory();
  
  // Setup customer search
  const searchInput = document.getElementById('customerSearch');
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value;
    const results = searchCustomers(query);
    renderCustomerDropdown(results);
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('customerDropdown');
    const searchWrapper = document.querySelector('.customer-search-wrapper');
    
    if (!searchWrapper.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
});
