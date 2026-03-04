// ─── CART STATE ───────────────────────────────────────────────────────────────

var cart = JSON.parse(localStorage.getItem('joshua-cart') || '[]');

function saveCart() {
  localStorage.setItem('joshua-cart', JSON.stringify(cart));
  updateCartCount();
}

function cartTotal() {
  return cart.reduce(function(sum, item) { return sum + item.price * item.quantity; }, 0);
}

function updateCartCount() {
  var count = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent = count > 0 ? '(' + count + ')' : '';
  });
}

function addToCart(product, size) {
  var existing = cart.find(function(i) { return i.id === product.id && i.size === size; });
  if (existing) { existing.quantity += 1; }
  else {
    cart.push({
      id: product.id, name: product.name, size: size,
      price: parseFloat(product.price.replace('€', '')),
      image: product.id + '-FRONT.jpg', quantity: 1
    });
  }
  saveCart();
  openCartDrawer();
}

function removeFromCart(id, size) {
  cart = cart.filter(function(i) { return !(i.id === id && i.size === size); });
  saveCart(); renderCartDrawer(); renderBagPage();
}

function changeQty(id, size, delta) {
  var item = cart.find(function(i) { return i.id === id && i.size === size; });
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) removeFromCart(id, size);
  else { saveCart(); renderCartDrawer(); renderBagPage(); }
}

// ─── CART DRAWER ──────────────────────────────────────────────────────────────

function openCartDrawer() {
  renderCartDrawer();
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  var el = document.getElementById('cart-drawer-items');
  if (!el) return;
  if (cart.length === 0) {
    el.innerHTML = '<div class="cart-empty">Your bag is empty.</div>';
    document.getElementById('cart-drawer-footer').style.display = 'none';
    return;
  }
  document.getElementById('cart-drawer-footer').style.display = 'block';
  var html = '';
  cart.forEach(function(item) {
    html += '<div class="cart-item">';
    html += '<div class="cart-item-img"><img src="' + item.image + '" alt="' + item.name + '"></div>';
    html += '<div class="cart-item-info">';
    html += '<div class="cart-item-name">' + item.name + '</div>';
    html += '<div class="cart-item-meta">Size ' + item.size + '</div>';
    html += '<div class="cart-item-qty">';
    html += '<button onclick="changeQty(\'' + item.id + '\',\'' + item.size + '\',-1)">−</button>';
    html += '<span>' + item.quantity + '</span>';
    html += '<button onclick="changeQty(\'' + item.id + '\',\'' + item.size + '\',1)">+</button>';
    html += '</div>';
    html += '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.id + '\',\'' + item.size + '\')">Remove</button>';
    html += '</div>';
    html += '<div class="cart-item-price">€' + (item.price * item.quantity).toFixed(0) + '</div>';
    html += '</div>';
  });
  el.innerHTML = html;
  document.getElementById('cart-drawer-total').textContent = '€' + cartTotal().toFixed(0);
}

// ─── BAG PAGE ─────────────────────────────────────────────────────────────────

function renderBagPage() {
  var el = document.getElementById('bag-items');
  if (!el) return;
  if (cart.length === 0) {
    el.innerHTML = '<div class="cart-empty">Your bag is empty.</div>';
    document.getElementById('bag-footer').style.display = 'none';
    return;
  }
  document.getElementById('bag-footer').style.display = 'grid';
  var html = '';
  cart.forEach(function(item) {
    html += '<div class="bag-item">';
    html += '<div class="bag-item-img"><img src="' + item.image + '" alt="' + item.name + '"></div>';
    html += '<div class="bag-item-details">';
    html += '<div class="bag-item-name">' + item.name.toUpperCase() + '</div>';
    html += '<div class="bag-item-meta">SIZE ' + item.size + '</div>';
    html += '<div class="cart-item-qty">';
    html += '<button onclick="changeQty(\'' + item.id + '\',\'' + item.size + '\',-1)">−</button>';
    html += '<span>' + item.quantity + '</span>';
    html += '<button onclick="changeQty(\'' + item.id + '\',\'' + item.size + '\',1)">+</button>';
    html += '</div>';
    html += '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.id + '\',\'' + item.size + '\')">Remove</button>';
    html += '</div>';
    html += '<div class="bag-item-price">€' + (item.price * item.quantity).toFixed(0) + '</div>';
    html += '</div>';
  });
  el.innerHTML = html;
  document.getElementById('bag-total').textContent = '€' + cartTotal().toFixed(0);
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────

function checkout() {
  if (cart.length === 0) return;
  var btns = document.querySelectorAll('.checkout-btn');
  btns.forEach(function(b) { b.textContent = 'Processing...'; b.disabled = true; });
  fetch('/.netlify/functions/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.url) { window.location.href = data.url; }
    else {
      alert('Something went wrong. Please try again.');
      btns.forEach(function(b) { b.textContent = 'Checkout'; b.disabled = false; });
    }
  })
  .catch(function() {
    alert('Something went wrong. Please try again.');
    btns.forEach(function(b) { b.textContent = 'Checkout'; b.disabled = false; });
  });
}

// ─── META ─────────────────────────────────────────────────────────────────────

var currentProduct = null;
var selectedSize = null;

function updateMeta(title, description, image) {
  document.title = title ? title + ' — Joshua Atelier' : 'Joshua Atelier — Premium European Lingerie';
  var desc = description || 'Intimate apparel designed for the way she moves.';
  var img = image || 'https://joshuaatelier.com/Joshua-logo-black.png';
  document.querySelector('meta[name="description"]').setAttribute('content', desc);
  document.querySelector('meta[property="og:title"]').setAttribute('content', document.title);
  document.querySelector('meta[property="og:description"]').setAttribute('content', desc);
  document.querySelector('meta[property="og:image"]').setAttribute('content', img);
  document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
  document.querySelector('meta[name="twitter:title"]').setAttribute('content', document.title);
  document.querySelector('meta[name="twitter:description"]').setAttribute('content', desc);
  document.querySelector('meta[name="twitter:image"]').setAttribute('content', img);
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────

function showPage(id, pushState) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById(id + '-page').classList.add('active');
  window.scrollTo(0, 0);
  if (pushState !== false) {
    history.pushState(null, '', window.location.pathname + (id === 'shop' ? '' : '#' + id));
  }
  if (id === 'shop') updateMeta(null, null, null);
  else if (id === 'about') updateMeta('About', 'The story behind Joshua intimate apparel.', null);
  else if (id === 'sizing') updateMeta('Sizing', null, null);
  else if (id === 'shipping') updateMeta('Shipping & Returns', null, null);
  else if (id === 'bag') { renderBagPage(); updateMeta('Shopping Bag', null, null); }
}

function openProduct(id, pushState) {
  currentProduct = products.find(function(p) { return p.id === id; });
  selectedSize = null;
  renderDetail(currentProduct);
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById('detail-page').classList.add('active');
  window.scrollTo(0, 0);
  if (pushState !== false) history.pushState(null, '', window.location.pathname + '#' + id);
  updateMeta(
    currentProduct.name,
    currentProduct.name + '. ' + currentProduct.composition + '. ' + currentProduct.price + '.',
    'https://joshuaatelier.com/' + currentProduct.id + '-FRONT.jpg'
  );
}

// ─── GRID ─────────────────────────────────────────────────────────────────────

function renderGrid() {
  var grid = document.getElementById('product-grid');
  var html = '';
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var front = p.id + '-FRONT.jpg';
    var back = p.hasBack ? p.id + '-BACK.jpg' : front;
    var cardClass = p.hasBack ? 'product-card has-back' : 'product-card';
    html += '<div class="' + cardClass + '" onclick="handleClick(event,\'' + p.id + '\')"';
    if (p.hasBack) html += ' onmouseenter="this.classList.add(\'flipped\')" onmouseleave="this.classList.remove(\'flipped\')"';
    html += ' ontouchstart="handleTouchStart(event,this)" ontouchend="handleTouchEnd(event,this)">';
    html += '<div class="img-container">';
    html += '<div class="img-front"><img src="' + front + '" alt="' + p.name + '" loading="lazy" onerror="this.style.opacity=0"/></div>';
    if (p.hasBack) html += '<div class="img-back"><img src="' + back + '" alt="' + p.name + '" loading="lazy" onerror="this.style.opacity=0"/></div>';
    html += '</div><div class="product-info">';
    html += '<div class="product-name">' + p.name + '</div>';
    html += '<div class="product-price">' + p.price + '</div>';
    html += '</div></div>';
  }
  grid.innerHTML = html;
}

// ─── TOUCH ────────────────────────────────────────────────────────────────────

var isTouchDevice = false;
var lastTouched = null;
var touchStartX = 0, touchStartY = 0;

document.addEventListener('touchstart', function() { isTouchDevice = true; }, { once: true });

function handleClick(e, id) { if (!isTouchDevice) openProduct(id); }

function handleTouchStart(e, card) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e, card) {
  var dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
  var dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
  if (dx > 8 || dy > 8) return;
  if (lastTouched && lastTouched !== card) lastTouched.classList.remove('flipped');
  if (card.classList.contains('flipped')) {
    var m = card.getAttribute('onclick').match(/'([^']+)'/);
    if (m) openProduct(m[1]);
    return;
  }
  if (card.classList.contains('has-back')) {
    card.classList.add('flipped'); lastTouched = card; e.preventDefault();
  } else {
    var m = card.getAttribute('onclick').match(/'([^']+)'/);
    if (m) openProduct(m[1]);
  }
}

// ─── DETAIL ───────────────────────────────────────────────────────────────────

function renderDetail(p) {
  var front = p.id + '-FRONT.jpg';
  var back = p.hasBack ? p.id + '-BACK.jpg' : null;
  document.getElementById('detail-main-img').src = front;
  document.getElementById('detail-main-img').alt = p.name;
  document.getElementById('detail-name').textContent = p.name;
  document.getElementById('detail-tagline').textContent = p.tagline || '';
  document.getElementById('detail-composition').textContent = p.composition;
  document.getElementById('more-details-content').style.display = 'none';
  document.getElementById('more-details-arrow').textContent = '+';
  document.getElementById('detail-product-details').textContent = p.details;
  document.getElementById('detail-price').textContent = p.price;
  var thumbs = document.getElementById('detail-thumbs');
  if (back) {
    thumbs.style.display = 'flex';
    thumbs.innerHTML = '<div class="detail-thumb active" onclick="switchImg(\'' + front + '\',this)"><img src="' + front + '" alt="Front"/></div>'
      + '<div class="detail-thumb" onclick="switchImg(\'' + back + '\',this)"><img src="' + back + '" alt="Back"/></div>';
  } else { thumbs.style.display = 'none'; thumbs.innerHTML = ''; }
  var sizes = ['XS','S','M','L'];
  var sizeHtml = '';
  sizes.forEach(function(s) {
    var inStock = p.stock[s] > 0;
    sizeHtml += '<button class="size-btn' + (!inStock ? ' out-of-stock' : '') + '"';
    if (inStock) sizeHtml += ' onclick="selectSize(\'' + s + '\',this)"';
    else sizeHtml += ' disabled';
    sizeHtml += '>' + s + '</button>';
  });
  document.getElementById('size-options').innerHTML = sizeHtml;
  document.getElementById('size-note').textContent = '';
}

function switchImg(src, thumb) {
  document.getElementById('detail-main-img').src = src;
  document.querySelectorAll('.detail-thumb').forEach(function(t) { t.classList.remove('active'); });
  thumb.classList.add('active');
}

function selectSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('size-note').textContent = '';
}

function handleBuy() {
  if (!selectedSize) { document.getElementById('size-note').textContent = 'Please select a size'; return; }
  addToCart(currentProduct, selectedSize);
}

function toggleMoreDetails() {
  var content = document.getElementById('more-details-content');
  var arrow = document.getElementById('more-details-arrow');
  var open = content.style.display === 'block';
  content.style.display = open ? 'none' : 'block';
  arrow.textContent = open ? '+' : '−';
}

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────

var lastTapTime = 0, lastImgTapTime = 0;

function handleProductImgTap(e) {
  if (isTouchDevice) {
    var now = Date.now();
    if (now - lastImgTapTime < 300) openLightbox(document.getElementById('detail-main-img').src);
    lastImgTapTime = now; e.stopPropagation();
  } else { openLightbox(document.getElementById('detail-main-img').src); }
}

function openLightbox(src) {
  var lb = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  img.src = src; img.style.width = '150%'; img.style.maxWidth = 'none'; img.style.maxHeight = 'none'; img.style.cursor = 'zoom-out';
  lb.style.display = 'flex'; lb.style.alignItems = 'flex-start'; lb.style.justifyContent = 'flex-start';
  lb.style.overflowY = 'auto'; lb.style.overflowX = 'auto';
  document.body.style.overflow = 'hidden'; lastTapTime = 0;
}

function closeLightbox() { document.getElementById('lightbox').style.display = 'none'; document.body.style.overflow = ''; }

function handleLightboxTap(e) {
  if (isTouchDevice) {
    var now = Date.now();
    if (now - lastTapTime < 300) closeLightbox();
    lastTapTime = now; e.stopPropagation();
  } else { closeLightbox(); }
}

document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { closeLightbox(); closeCartDrawer(); } });

// ─── ROUTING ──────────────────────────────────────────────────────────────────

function handleRoute() {
  var hash = window.location.hash.replace('#', '');
  if (!hash) showPage('shop', false);
  else if (hash === 'about') showPage('about', false);
  else if (hash === 'sizing') showPage('sizing', false);
  else if (hash === 'shipping') showPage('shipping', false);
  else if (hash === 'bag') showPage('bag', false);
  else if (hash === 'order-success') { showPage('shop', false); cart = []; saveCart(); }
  else { var p = products.find(function(p) { return p.id === hash; }); if (p) openProduct(hash, false); else showPage('shop', false); }
}

window.addEventListener('popstate', handleRoute);

function fixContentPadding() {
  var header = document.querySelector('header');
  var height = header.getBoundingClientRect().height;
  document.querySelectorAll('.content').forEach(function(el) { el.style.paddingTop = (height + 8) + 'px'; });
}

window.addEventListener('resize', fixContentPadding);
fixContentPadding();
renderGrid();
handleRoute();
updateCartCount();
