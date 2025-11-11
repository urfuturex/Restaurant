document.addEventListener('DOMContentLoaded', function () {
  // 3D Carousel: rotate images with position effect
  const leftArrow = document.querySelector('.arrow-left');
  const rightArrow = document.querySelector('.arrow-right');
  const imgs = Array.from(document.querySelectorAll('.food-slider img'));

  // Track current position
  let currentPosition = 0; // 0 = left, 1 = center, 2 = right

  // Original classes for each position
  const positions = ['img-left', 'img-center', 'img-right'];

  function updateCarousel() {
    imgs.forEach((img, idx) => {
      // Remove all position classes
      img.classList.remove('img-left', 'img-center', 'img-right');
      
      // Calculate new position
      const newPositionIdx = (idx - currentPosition + imgs.length) % imgs.length;
      const newClass = positions[newPositionIdx];
      
      // Add new class
      img.classList.add(newClass);
    });
  }

  function rotateRight() {
    currentPosition = (currentPosition + 1) % imgs.length;
    updateCarousel();
  }

  function rotateLeft() {
    currentPosition = (currentPosition - 1 + imgs.length) % imgs.length;
    updateCarousel();
  }

  if (leftArrow) leftArrow.addEventListener('click', rotateLeft);
  if (rightArrow) rightArrow.addEventListener('click', rotateRight);

  // Keyboard support
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') rotateLeft();
    if (e.key === 'ArrowRight') rotateRight();
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // --- Chatbot widget behavior ---
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const chatbotBubble = document.getElementById('chatbotBubble');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSend = document.getElementById('chatbotSend');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotMinimize = document.getElementById('chatbotMinimize');

  // helper to append messages
  function appendMessage(text, who) {
    const div = document.createElement('div');
    div.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
    div.textContent = text;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // simple auto-reply logic
  function botReply(userText) {
    const reply = "Cảm ơn! Mình gợi ý món đặc biệt hôm nay: Sashimi cá hồi. Bạn có muốn đặt bàn không?";
    setTimeout(() => appendMessage(reply, 'bot'), 700);
  }

  // show bubble briefly on load
  if (chatbotBubble) {
    setTimeout(() => {
      if (chatbotBubble) chatbotBubble.classList.add('visible');
    }, 600);
    // hide after a few seconds
    setTimeout(() => {
      if (chatbotBubble) chatbotBubble.classList.add('hidden');
    }, 6000);
    chatbotBubble.addEventListener('click', () => {
      if (chatbotWindow) {
        chatbotWindow.classList.add('open');
        chatbotWindow.setAttribute('aria-hidden', 'false');
      }
      chatbotBubble.classList.add('hidden');
      // welcome message
      appendMessage("Xin chào! Mình là Trợ lý Wa. Mình có thể gợi ý món ăn hoặc giúp bạn đặt bàn.", 'bot');
    });
  }

  if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
      if (chatbotWindow.classList.contains('open')) {
        chatbotWindow.classList.remove('open');
        chatbotWindow.setAttribute('aria-hidden', 'true');
      } else {
        chatbotWindow.classList.add('open');
        chatbotWindow.setAttribute('aria-hidden', 'false');
        // initial message if none
        if (!chatbotMessages.children.length) {
          appendMessage("Xin chào! Mình là Trợ lý Wa. Mình có thể gợi ý món ăn hoặc giúp bạn đặt bàn.", 'bot');
        }
      }
      if (chatbotBubble) chatbotBubble.classList.add('hidden');
    });
  }

  if (chatbotSend && chatbotInput) {
    chatbotSend.addEventListener('click', () => {
      const val = chatbotInput.value && chatbotInput.value.trim();
      if (!val) return;
      appendMessage(val, 'user');
      chatbotInput.value = '';
      botReply(val);
    });
    chatbotInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        chatbotSend.click();
      }
    });
  }

  if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
      if (chatbotWindow) {
        chatbotWindow.classList.remove('open');
        chatbotWindow.setAttribute('aria-hidden', 'true');
      }
    });
  }

  if (chatbotMinimize) {
    chatbotMinimize.addEventListener('click', () => {
      if (chatbotWindow) {
        chatbotWindow.classList.remove('open');
        chatbotWindow.setAttribute('aria-hidden', 'true');
      }
      if (chatbotBubble) chatbotBubble.classList.remove('hidden');
    });
  }

  // Menu page: simple tab filter and sort (if on menu.html)
  const menuGrid = document.getElementById('menuGrid');
  if (menuGrid) {
    const tabs = document.querySelectorAll('.menu-tabs .tab');
    const sort = document.getElementById('menuSort');

    function applyFilter(cat) {
      const cards = Array.from(menuGrid.querySelectorAll('.menu-card'));
      cards.forEach(c => {
        if (cat === 'all' || c.dataset.category === cat) c.style.display = '';
        else c.style.display = 'none';
      });
    }

    tabs.forEach(t => t.addEventListener('click', (e) => {
      tabs.forEach(x => x.setAttribute('aria-selected', 'false'));
      e.currentTarget.setAttribute('aria-selected', 'true');
      applyFilter(e.currentTarget.dataset.cat);
    }));

    if (sort) {
      sort.addEventListener('change', () => {
        const cards = Array.from(menuGrid.querySelectorAll('.menu-card'));
        if (sort.value === 'price-asc' || sort.value === 'price-desc') {
          cards.sort((a,b)=>{
            const pa = parseInt(a.querySelector('.price').textContent.replace(/[^0-9]/g,''),10)||0;
            const pb = parseInt(b.querySelector('.price').textContent.replace(/[^0-9]/g,''),10)||0;
            return sort.value === 'price-asc' ? pa-pb : pb-pa;
          });
          cards.forEach(c=>menuGrid.appendChild(c));
        }
      });
    }
  }

  // Menu Item Popup functionality
  const menuPopup = document.getElementById('menuPopup');
  const closePopup = document.getElementById('closePopup');
  const popupImage = document.getElementById('popupImage');
  const popupTitle = document.getElementById('popupTitle');
  const popupPrice = document.getElementById('popupPrice');
  const quantityInput = document.getElementById('quantity');
  const increaseQty = document.getElementById('increaseQty');
  const decreaseQty = document.getElementById('decreaseQty');
  const addToCartBtn = document.querySelector('.btn-add-cart');
  
  let currentItemId = null;

  if (menuPopup) {
    // Add click event to all menu cards
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
      card.addEventListener('click', function() {
        // Get data from clicked card
        const image = this.querySelector('img').src;
        const title = this.querySelector('.title').textContent;
        const price = this.querySelector('.price').textContent;
        currentItemId = this.getAttribute('data-item-id') || 1; // Default to 1 if not set
        
        // Set popup data
        popupImage.src = image;
        popupTitle.textContent = title;
        popupPrice.textContent = price;
        
        // Reset quantity
        quantityInput.value = 1;
        
        // Show popup
        menuPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close popup when clicking X button
    if (closePopup) {
      closePopup.addEventListener('click', function() {
        menuPopup.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    }

    // Close popup when clicking overlay
    menuPopup.addEventListener('click', function(e) {
      if (e.target === menuPopup) {
        menuPopup.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    // Close popup with ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menuPopup.classList.contains('active')) {
        menuPopup.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    // Quantity controls
    if (increaseQty) {
      increaseQty.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
      });
    }

    if (decreaseQty) {
      decreaseQty.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });
    }
    
    // Add to cart button
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', async function() {
        const quantity = parseInt(quantityInput.value);
        
        // Check if addToCart function exists (from cart.js)
        if (typeof addToCart === 'function') {
          await addToCart(currentItemId, quantity);
        } else {
          // Fallback: show alert
          alert(`Đã thêm ${quantity} x ${popupTitle.textContent} vào giỏ hàng`);
          menuPopup.classList.remove('active');
          document.body.style.overflow = 'auto';
        }
      });
    }
  }
});
