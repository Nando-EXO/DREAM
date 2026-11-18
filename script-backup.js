/*
  DREAM product catalog.
  Untuk menambahkan produk baru, tambahkan objek ke array PRODUCTS.
  images harus berisi URL gambar langsung (jpg/png/webp) yang memang sesuai produk.
*/

const PRODUCTS = [
  {
    id: "iphone-18-pro-max",
    name: "iPhone 18 Pro Max",
    category: "gadget",
    price: 24000000,
    description: "Smartphone premium.",
    tokopediaUrl: "https://tk.tokopedia.com/ZSpqQb2Jj/",
    images: ["https://p16-images-sign-sg.tokopedia-static.net/tos-alisg-i-aphluv4xwc-sg/3a4180694a0b4c8197d6c6dab19d3e4d~tplv-aphluv4xwc-resize-jpeg:700:0.jpeg?lk3s=0ccea506&x-expires=1794742591&x-signature=EmpIjvnX5EQ7vM7hSpR9JwbshwA%3D&x-signature-webp=BFX2DqEZALfOmwgB8WWcoaVlnoU%3D"]
  },
  {
    id: "livegear-lyra",
    name: "LiveGear Lyra Ultimate All in One PC",
    category: "komputer",
    price: 70000000,
    description: "All in One PC untuk broadcasting, vMix, OBS, dan Resolume dengan monitor IPS 18,5 inci.",
    tokopediaUrl: "https://www.tokopedia.com/mitra-visual-store/livegear-lyra-ultimate-all-in-one-pc-broadcasting-for-vmix-obs-resolume-dedicated-18-5-inch-ips-monitor-keyboard-midi-1734023584516703391",
    images: ["https://p16-images-sign-sg.tokopedia-static.net/tos-alisg-i-aphluv4xwc-sg/001bbcf8a70a4d6e9e5629db02c803da~tplv-aphluv4xwc-white-pad-v1:1600:1600.jpeg?lk3s=0ccea506&x-expires=1794741219&x-signature=j31BV1uRUkdPNfD1V3%2B25AIEjGg%3D&x-signature-webp=%2FV8J6EWtuBFjYd%2FE5Og1CPhAXLM%3D"]
  }
];


const CART_KEY = "dream-cart-v1";
let cart = loadCart();
let activeProduct = null;
let activeImageIndex = 0;
let currentFilter = "all";
let toastTimer;

const rupiah = value => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(value);

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function imageMarkup(product, className = "") {
  const src = product.images && product.images[0];
  if (src) return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(product.name)}" loading="lazy">`;
  return `<div class="image-placeholder ${className}"><span class="placeholder-symbol">D.</span><small>Foto produk belum tersedia</small></div>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function renderProducts() {
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
  const visible = PRODUCTS.filter(product => {
    const matchesFilter = currentFilter === "all" || product.category === currentFilter;
    const matchesSearch = `${product.name} ${product.description}`.toLowerCase().includes(keyword);
    return matchesFilter && matchesSearch;
  });

  document.getElementById("catalogCount").textContent = `${visible.length} produk tersedia`;
  document.getElementById("emptyState").hidden = visible.length !== 0;

  document.getElementById("productGrid").innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image-wrap" data-detail="${escapeHtml(product.id)}" role="button" tabindex="0" aria-label="Lihat ${escapeHtml(product.name)}">
        <span class="product-tag">PILIHAN DREAM</span>
        ${imageMarkup(product)}
      </div>
      <div class="product-content">
        <div class="product-category">${escapeHtml(product.category.toUpperCase())}</div>
        <h3>${escapeHtml(product.name)}</h3>
        <p class="product-description">${escapeHtml(product.description)}</p>
        <div class="product-card-bottom">
          <span class="product-price">${rupiah(product.price)}</span>
          <button class="add-button" data-add="${escapeHtml(product.id)}">+ Keranjang</button>
        </div>
        <button class="card-details" data-detail="${escapeHtml(product.id)}">Lihat detail & foto ↗</button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart();
  renderCart();
  showToast(`${product.name} ditambahkan ke keranjang`);
}

function changeQuantity(id, amount) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== id);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(entry => entry.id !== id);
  saveCart();
  renderCart();
  showToast("Produk dihapus dari keranjang");
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("summaryQty").textContent = count;
  document.getElementById("summaryTotal").textContent = rupiah(total);

  const items = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return "";
    return `
      <div class="cart-row">
        <div class="cart-thumb">${imageMarkup(product)}</div>
        <div>
          <div class="cart-product-name">${escapeHtml(product.name)}</div>
          <div class="cart-product-price">${rupiah(product.price)}</div>
          <div class="quantity-control">
            <button data-qty="${escapeHtml(product.id)}" data-amount="-1" aria-label="Kurangi">−</button>
            <span>${item.quantity}</span>
            <button data-qty="${escapeHtml(product.id)}" data-amount="1" aria-label="Tambah">+</button>
          </div>
        </div>
        <button class="remove-item" data-remove="${escapeHtml(product.id)}">Hapus</button>
      </div>
    `;
  }).join("");

  document.getElementById("cartItems").innerHTML = items;
  const isEmpty = cart.length === 0;
  document.getElementById("cartEmpty").hidden = !isEmpty;
  document.getElementById("cartSummary").hidden = isEmpty;
}

function openOverlay(id) {
  const overlay = document.getElementById(id);
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeOverlay(id) {
  const overlay = document.getElementById(id);
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".overlay.open") && !document.getElementById("zoomOverlay").classList.contains("open")) {
    document.body.style.overflow = "";
  }
}

function showProductDetail(id) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) return;
  activeProduct = product;
  activeImageIndex = 0;

  document.getElementById("detailName").textContent = product.name;
  document.getElementById("detailPrice").textContent = rupiah(product.price);
  document.getElementById("detailDescription").textContent = product.description;
  document.getElementById("detailTokopedia").href = product.tokopediaUrl || "#";
  document.getElementById("detailAdd").onclick = () => addToCart(product.id);

  renderDetailImage();
  openOverlay("detailOverlay");
}

function renderDetailImage() {
  const product = activeProduct;
  const main = document.getElementById("detailMainImage");
  const images = product.images || [];
  if (images.length) {
    main.innerHTML = `<img src="${escapeHtml(images[activeImageIndex])}" alt="${escapeHtml(product.name)}"><button class="zoom-hint" id="zoomImage" type="button">↗ Perbesar foto</button>`;
  } else {
    main.innerHTML = `<div class="image-placeholder large"><span class="placeholder-symbol">D.</span><small>Foto produk belum tersedia</small></div><button class="zoom-hint" id="zoomImage" type="button">↗ Lihat tampilan</button>`;
  }
  document.getElementById("zoomImage").onclick = openZoom;

  const thumbs = images.length ? images : [null];
  document.getElementById("thumbnailRow").innerHTML = thumbs.map((src, index) => `
    <button class="thumbnail ${index === activeImageIndex ? "active" : ""}" data-image-index="${index}" aria-label="Foto ${index + 1}">
      ${src ? `<img src="${escapeHtml(src)}" alt="Foto ${escapeHtml(product.name)} ${index + 1}">` : `<div class="image-placeholder"><span class="placeholder-symbol">D.</span></div>`}
    </button>
  `).join("");
}

function openZoom() {
  const product = activeProduct;
  const src = product && product.images && product.images[activeImageIndex];
  document.getElementById("zoomImageContent").innerHTML = src
    ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(product.name)}">`
    : `<div class="image-placeholder"><span class="placeholder-symbol">D.</span><small>Foto produk resmi belum ditambahkan</small></div>`;
  openOverlay("zoomOverlay");
}

function openCart() {
  renderCart();
  openOverlay("cartOverlay");
}

function checkout() {
  const selected = cart.map(item => ({
    product: PRODUCTS.find(p => p.id === item.id),
    quantity: item.quantity
  })).filter(item => item.product);

  if (!selected.length) return;

  // Tokopedia does not automatically receive DREAM's cart.
  // Open each product page separately; the shopper completes each purchase there.
  const urls = [...new Set(selected.map(item => item.product.tokopediaUrl).filter(Boolean))];
  if (!urls.length) {
    showToast("Tautan Tokopedia belum tersedia untuk produk ini");
    return;
  }

  urls.forEach(url => window.open(url, "_blank", "noopener,noreferrer"));
  showToast("Halaman produk Tokopedia dibuka. Checkout dilakukan di Tokopedia.");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// Event delegation for product cards, cart and thumbnails.
document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) return addToCart(add.dataset.add);

  const detail = event.target.closest("[data-detail]");
  if (detail) return showProductDetail(detail.dataset.detail);

  const qty = event.target.closest("[data-qty]");
  if (qty) return changeQuantity(qty.dataset.qty, Number(qty.dataset.amount));

  const remove = event.target.closest("[data-remove]");
  if (remove) return removeFromCart(remove.dataset.remove);

  const thumb = event.target.closest("[data-image-index]");
  if (thumb && activeProduct) {
    activeImageIndex = Number(thumb.dataset.imageIndex);
    return renderDetailImage();
  }

  const close = event.target.closest("[data-close]");
  if (close) return closeOverlay(close.dataset.close);

  if (event.target.classList.contains("overlay")) closeOverlay(event.target.id);
  if (event.target.id === "zoomOverlay") closeOverlay("zoomOverlay");
});

document.getElementById("productGrid").addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-detail]")) {
    event.preventDefault();
    showProductDetail(event.target.dataset.detail);
  }
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("checkoutButton").addEventListener("click", checkout);
document.getElementById("searchInput").addEventListener("input", renderProducts);
document.querySelectorAll(".filter-chip").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderProducts();
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    ["detailOverlay", "cartOverlay", "zoomOverlay"].forEach(id => closeOverlay(id));
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.getElementById("searchInput").focus();
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
