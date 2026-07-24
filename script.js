// ============================================================
// DO NOT EDIT - CORE LOGIC START
// ============================================================

const VENDOR_WHATSAPP = "233531408169";

const foodItems = [
  {
    id: 1,
    name: "Jollof Rice + Chicken",
    desc: "Smoky party jollof with spicy grilled chicken and shito on the side.",
    newPrice: 35, oldPrice: 40,
    img: "FoodCardPics/Jollof_Rice_Chicken.jpg"
  },
  {
    id: 2,
    name: "Waakye + Fish + Egg",
    desc: "Authentic waakye with fried fish, boiled egg, wele, gari and shito.",
    newPrice: 25, oldPrice: 30,
    img: "FoodCardPics/Waakye_Fish_Egg.jpg"
  },
  {
    id: 3,
    name: "Fufu + Light Soup",
    desc: "Pounded fufu served with rich goat meat light soup. Hot and fresh.",
    newPrice: 40, oldPrice: 45,
    img: "FoodCardPics/Fufu_Light_Soup.jpg"
  },
  {
    id: 4,
    name: "Banku + Grilled Tilapia",
    desc: "Charcoal-grilled tilapia with banku, hot pepper sauce and shito.",
    newPrice: 50, oldPrice: 60,
    img: "FoodCardPics/Banku_Grilled_Tilapia.jpg"
  },
  {
    id: 5,
    name: "Kelewele + Groundnuts",
    desc: "Spiced fried plantain cubes tossed with roasted groundnuts. A Ghanaian street classic.",
    newPrice: 15, oldPrice: 20,
    img: "FoodCardPics/Kelewele_Groundnuts.jpg"
  },
  {
    id: 6,
    name: "Kontomire Stew + Yam",
    desc: "Cocoyam leaf stew cooked with smoked fish and palm oil, served with boiled yam.",
    newPrice: 30, oldPrice: 35,
    img: "FoodCardPics/Kontomire_Stew_Yam.jpg"
  },
  {
    id: 7,
    name: "Omo Tuo + Groundnut Soup",
    desc: "Soft rice balls in a rich, creamy groundnut soup with chicken. Northern Ghana favourite.",
    newPrice: 38, oldPrice: 45,
    img: "FoodCardPics/Omo_Tuo_Groundnut_Soup.jpg"
  },
  {
    id: 8,
    name: "Tuo Zaafi + Ayoyo Soup",
    desc: "Northern TZ with fresh ayoyo leaf soup, dried fish and dawadawa seasoning.",
    newPrice: 32, oldPrice: 38,
    img: "FoodCardPics/Tuo_Zaafi_Ayoyo_Soup.jpg"
  }
];

let cart = [];
let currentProduct = null;
let currentQty = 1;

window.onload = function() {
  renderFoodGrid();
  updateCartCount();
};

function renderFoodGrid() {
  const grid = document.getElementById('foodGrid');
  grid.innerHTML = '';
  foodItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.onclick = () => openProductModal(item);
    card.innerHTML = `
      <div class="food-card-img-wrap">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
      </div>
      <div class="food-info">
        <h3>${item.name}</h3>
        <p class="food-desc">${item.desc}</p>
        <div class="card-footer-row">
          <div class="price-wrap">
            <span class="new-price">GH₵${item.newPrice}</span>
            <span class="old-price">GH₵${item.oldPrice}</span>
          </div>
          <div class="card-order-hint">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Order
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openProductModal(product) {
  currentProduct = product;
  currentQty = 1;
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductImg').src = product.img;
  document.getElementById('modalProductDesc').textContent = product.desc;
  document.getElementById('modalProductPrice').textContent = `GH₵${product.newPrice}`;
  document.getElementById('modalProductOldPrice').textContent = `GH₵${product.oldPrice}`;
  document.getElementById('qtyDisplay').textContent = currentQty;
  document.getElementById('productModal').classList.add('active');
  lockBody();
}

function changeQty(amount) {
  currentQty += amount;
  if (currentQty < 1) currentQty = 1;
  document.getElementById('qtyDisplay').textContent = currentQty;
}

function addToCart() {
  const existingItem = cart.find(item => item.id === currentProduct.id);
  if (existingItem) {
    existingItem.qty += currentQty;
  } else {
    cart.push({ ...currentProduct, qty: currentQty });
  }
  updateCartCount();
  closeModal('productModal');
  showToast('Added to cart \u2713');
  openCartModal();
}

function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById('cartCount');
  countEl.textContent = totalQty;
  countEl.classList.remove('bounce');
  void countEl.offsetWidth;
  countEl.classList.add('bounce');
}

function openCartModal() {
  renderCart();
  document.getElementById('cartModal').classList.add('active');
  lockBody();
}

function renderCart() {
  const cartBody   = document.getElementById('cartBody');
  const cartFooter = document.getElementById('cartFooter');

  if (cart.length === 0) {
    cartFooter.style.display = 'none';
    cartBody.innerHTML = `
      <div class="empty-cart">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p>Your cart is empty</p>
        <span>Browse the menu and add something delicious!</span>
      </div>`;
    return;
  }

  let total = 0;
  let html = '<div class="cart-items-list">';
  cart.forEach((item, index) => {
    const itemTotal = item.newPrice * item.qty;
    total += itemTotal;
    html += `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="cart-item-price">GH₵${item.newPrice} each</span>
        </div>
        <div class="cart-item-right">
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="updateCartItemQty(${index}, -1)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateCartItemQty(${index}, 1)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <span class="cart-item-subtotal">GH₵${itemTotal}</span>
        </div>
      </div>`;
  });
  html += '</div>';
  cartBody.innerHTML = html;

  cartFooter.style.display = 'block';
  cartFooter.innerHTML = `
    <div class="cart-summary">
      <div class="cart-summary-row">
        <span>Subtotal</span><span>GH₵${total}</span>
      </div>
      <div class="cart-summary-row cart-summary-total">
        <span>Total</span><span>GH₵${total}</span>
      </div>
    </div>
    <button class="checkout-btn" onclick="openCheckoutModal()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
      Proceed to Checkout
    </button>`;
}

function updateCartItemQty(index, amount) {
  cart[index].qty += amount;
  if (cart[index].qty < 1) cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

function openCheckoutModal() {
  if (cart.length === 0) return;
  const total = cart.reduce((sum, item) => sum + (item.newPrice * item.qty), 0);
  document.getElementById('checkoutTotal').textContent = `GH₵${total}`;
  closeModal('cartModal');
  document.getElementById('checkoutModal').classList.add('active');
  lockBody();
}

function sendWhatsAppOrder() {
  const name     = document.getElementById('customerName').value.trim();
  const phone    = document.getElementById('customerPhone').value.trim();
  const location = document.getElementById('customerLocation').value.trim();
  const note     = document.getElementById('customerNote').value.trim();

  if (!name || !phone) {
    alert('Please enter your name and WhatsApp number');
    return;
  }

  let message = `*NEW ORDER - Mama Efua's Kitchen*\n\n`;
  message += `*Customer:* ${name}\n`;
  message += `*Phone:* ${phone}\n`;
  if (location) message += `*Location:* ${location}\n`;
  if (note)     message += `*Note:* ${note}\n`;
  message += `\n*ORDER DETAILS:*\n`;

  let total = 0;
  cart.forEach(item => {
    const itemTotal = item.newPrice * item.qty;
    total += itemTotal;
    message += `• ${item.name} x${item.qty} - GH₵${itemTotal}\n`;
  });

  message += `\n*TOTAL: GH₵${total}*\n\nPlease confirm my order. Thank you!`;

  const whatsappURL = `https://wa.me/${VENDOR_WHATSAPP}?text=${encodeURIComponent(message)}`;

  cart = [];
  updateCartCount();
  closeModal('checkoutModal');
  document.getElementById('customerName').value    = '';
  document.getElementById('customerPhone').value   = '';
  document.getElementById('customerLocation').value = '';
  document.getElementById('customerNote').value    = '';

  window.location.href = whatsappURL;
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('closing');
  setTimeout(() => {
    modal.classList.remove('active', 'closing');
    unlockBody();
  }, 300);
}

window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    const modal = event.target;
    modal.classList.add('closing');
    setTimeout(() => {
      modal.classList.remove('active', 'closing');
      unlockBody();
    }, 300);
  }
};

// ============================================================
// DO NOT EDIT - CORE LOGIC END
// ============================================================

// Body scroll lock
function lockBody() {
  document.body.classList.add('modal-open');
}

function unlockBody() {
  document.body.classList.remove('modal-open');
}

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// Info modal
function openInfoModal() {
  switchInfoTab(0);
  document.getElementById('infoModal').classList.add('active');
  lockBody();
}

function switchInfoTab(index) {
  document.querySelectorAll('.info-tab').forEach((t, i) => t.classList.toggle('active', i === index));
  document.querySelectorAll('.info-panel').forEach((p, i) => p.classList.toggle('active', i === index));
}

// Scroll to menu accounting for sticky header
function scrollToMenu() {
  const menu = document.getElementById('menuSection');
  const headerH = document.querySelector('header').offsetHeight;
  const top = menu.getBoundingClientRect().top + window.scrollY - headerH;
  window.scrollTo({ top, behavior: 'smooth' });
}

// Header transparency on scroll
window.addEventListener('scroll', () => {
  document.querySelector('header').classList.toggle('scrolled', window.scrollY > 40);
});

// Slideshow
(function() {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0;
  let timer;

  function activate(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => activate(current + 1), 4500);
  }

  window.moveSlide = function(dir) { activate(current + dir); startTimer(); };
  window.goToSlide = function(i)   { activate(i);             startTimer(); };

  startTimer();
})();
