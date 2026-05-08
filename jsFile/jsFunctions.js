// =========================================================
// TOY STORE - Global JS Functions
// =========================================================

// ---- Navbar loader ----
function loadNavbar() {
  const el = document.getElementById("navbar-placeholder");
  if (!el) return;
  const depth = el.dataset.depth || "";
  fetch(depth + "pages/navbar.html")
    .then(r => r.text())
    .then(html => {
      el.innerHTML = html;
      initMenuToggle();
      highlightActiveNav();
    });
}

function initMenuToggle() {
  const btn = document.querySelector(".menu-toggle");
  const ul  = document.querySelector("nav ul");
  if (btn && ul) btn.addEventListener("click", () => ul.classList.toggle("open"));
}

function highlightActiveNav() {
  const links = document.querySelectorAll("nav a");
  links.forEach(a => {
    if (a.href === window.location.href) a.style.background = "rgba(255,255,255,0.25)";
  });
}

// ---- Cart helpers (localStorage) ----
function getCart() {
  return JSON.parse(localStorage.getItem("ts_cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("ts_cart", JSON.stringify(cart));
}
function addToCart(item) {
  const cart = getCart();
  const idx  = cart.findIndex(c => c.id === item.id);
  if (idx > -1) cart[idx].qty++;
  else cart.push({ ...item, qty: 1 });
  saveCart(cart);
  updateCartBadge();
  alert("Added to cart: " + item.name);
}
function removeFromCart(id) {
  saveCart(getCart().filter(c => c.id !== id));
  updateCartBadge();
}
function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  badge.textContent = getCart().reduce((s, c) => s + c.qty, 0);
}

// ---- Search / Filter ----
function filterProducts() {
  const q    = (document.getElementById("search-input")?.value || "").toLowerCase();
  const cat  = document.getElementById("cat-filter")?.value   || "";
  const priceMax = parseFloat(document.getElementById("price-filter")?.value || "9999");
  const cards = document.querySelectorAll(".product-card");
  cards.forEach(card => {
    const name  = (card.dataset.name  || "").toLowerCase();
    const cardCat = card.dataset.category || "";
    const price = parseFloat(card.dataset.price || "0");
    const show  = name.includes(q) && (cat === "" || cardCat === cat) && price <= priceMax;
    card.style.display = show ? "" : "none";
  });
}

// ---- Simple bar chart (canvas) ----
function drawBarChart(canvasId, labels, values, title) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const pad = 50, barW = (W - pad * 2) / labels.length - 12;
  const maxVal = Math.max(...values, 1);
  ctx.clearRect(0, 0, W, H);
  // Title
  ctx.fillStyle = "#004E89"; ctx.font = "bold 14px Segoe UI";
  ctx.textAlign = "center"; ctx.fillText(title, W/2, 22);
  // Axes
  ctx.strokeStyle = "#ccc"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pad, pad); ctx.lineTo(pad, H-pad); ctx.lineTo(W-pad, H-pad); ctx.stroke();
  // Bars
  const colors = ["#FF6B35","#004E89","#1A936F","#F7C59F","#EFEFD0","#FF6B35"];
  labels.forEach((lbl, i) => {
    const x = pad + i * ((W - pad*2) / labels.length) + 6;
    const barH = ((values[i] / maxVal) * (H - pad*2));
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, H-pad-barH, barW, barH);
    ctx.fillStyle = "#333"; ctx.font = "11px Segoe UI"; ctx.textAlign = "center";
    ctx.fillText(lbl, x + barW/2, H - pad + 14);
    ctx.fillStyle = "#004E89"; ctx.font = "bold 11px Segoe UI";
    ctx.fillText(values[i], x + barW/2, H-pad-barH - 4);
  });
}

// ---- Theme toggle ----
function toggleTheme() {
  const body = document.body;
  body.dataset.theme = body.dataset.theme === "dark" ? "" : "dark";
  localStorage.setItem("ts_theme", body.dataset.theme);
}
function applySavedTheme() {
  const t = localStorage.getItem("ts_theme");
  if (t) document.body.dataset.theme = t;
}

// ---- Auth helpers ----
function isLoggedIn() { return !!localStorage.getItem("ts_user"); }
function requireLogin() {
  if (!isLoggedIn()) { window.location.href = "login.html"; }
}
function logout() {
  localStorage.removeItem("ts_user");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  loadNavbar();
  updateCartBadge();
});