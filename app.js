var currentProduct = null;
var selectedSize = null;

function showPage(id) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.getElementById(id + '-page').classList.add('active');
  window.scrollTo(0, 0);
}

function openProduct(id) {
  currentProduct = products.find(function(p) { return p.id === id; });
  selectedSize = null;
  renderDetail(currentProduct);
  showPage('detail');
}

function renderGrid() {
  var grid = document.getElementById('product-grid');
  var html = '';
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var front = p.id + '-FRONT.jpg';
    var back = p.hasBack ? p.id + '-BACK.jpg' : front;
    html += '<div class="product-card" onclick="openProduct(\'' + p.id + '\')"';
    if (p.hasBack) {
      html += ' onmouseenter="this.classList.add(\'flipped\')" onmouseleave="this.classList.remove(\'flipped\')" ontouchstart="handleTouch(event,this)"';
    }
    html += '>';
    html += '<div class="img-container">';
    html += '<div class="img-front"><img src="' + front + '" alt="' + p.name + '" loading="lazy" onerror="this.style.opacity=0" /></div>';
    if (p.hasBack) {
      html += '<div class="img-back"><img src="' + back + '" alt="' + p.name + '" loading="lazy" onerror="this.style.opacity=0" /></div>';
    }
    html += '</div>';
    html += '<div class="product-info">';
    html += '<div class="product-name">' + p.name + '</div>';
    html += '<div class="product-price">' + p.price + '</div>';
    html += '</div></div>';
  }
  grid.innerHTML = html;
}

var lastTouched = null;
function handleTouch(e, card) {
  if (lastTouched && lastTouched !== card) lastTouched.classList.remove('flipped');
  if (card.classList.contains('flipped')) {
    var m = card.getAttribute('onclick').match(/'([^']+)'/);
    if (m) openProduct(m[1]);
    return;
  }
  card.classList.add('flipped');
  lastTouched = card;
  e.preventDefault();
}

function renderDetail(p) {
  var front = p.id + '-FRONT.jpg';
  var back = p.hasBack ? p.id + '-BACK.jpg' : null;
  document.getElementById('detail-main-img').src = front;
  document.getElementById('detail-main-img').alt = p.name;
  document.getElementById('detail-name').textContent = p.name;
  document.getElementById('detail-composition').textContent = p.composition;
  document.getElementById('detail-product-details').textContent = p.details;
  document.getElementById('detail-price').textContent = p.price;
  var thumbs = document.getElementById('detail-thumbs');
  if (back) {
    thumbs.style.display = 'flex';
    thumbs.innerHTML = '<div class="detail-thumb active" onclick="switchImg(\'' + front + '\',this)"><img src="' + front + '" alt="Front"/></div>'
      + '<div class="detail-thumb" onclick="switchImg(\'' + back + '\',this)"><img src="' + back + '" alt="Back"/></div>';
  } else {
    thumbs.style.display = 'none';
    thumbs.innerHTML = '';
  }
  var sizes = ['XS','S','M','L'];
  var sizeHtml = '';
  for (var i = 0; i < sizes.length; i++) {
    var s = sizes[i];
    var inStock = p.stock[s] > 0;
    sizeHtml += '<button class="size-btn' + (!inStock ? ' out-of-stock' : '') + '"';
    if (inStock) sizeHtml += ' onclick="selectSize(\'' + s + '\',this)"';
    else sizeHtml += ' disabled';
    sizeHtml += '>' + s + '</button>';
  }
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
  if (!selectedSize) {
    document.getElementById('size-note').textContent = 'Please select a size';
    return;
  }
  var url = currentProduct.stripeLinks[selectedSize];
  if (url) {
    window.location.href = url;
  } else {
    document.getElementById('size-note').textContent = 'Purchase link coming soon.';
  }
}

renderGrid();
