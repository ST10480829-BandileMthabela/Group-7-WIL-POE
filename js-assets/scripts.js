
let currentSlide = 0;
let cart = [];

function loadCart() {
const saved = localStorage.getItem('empowering-cart');
if (saved) {
cart = JSON.parse(saved);
updateCartBadge();
}
}

function saveCart() {
localStorage.setItem('empowering-cart', JSON.stringify(cart));
}

function showToast(title, message, type = 'success') {
const container = document.getElementById('toast-container');
const toast = document.createElement('div');
toast.className = `toast ${type}`;
const icon = type === 'success' ? '✓' : '✕';
toast.innerHTML = `
<div class="toast-icon">${icon}</div>
<div class="toast-content">
<div class="toast-title">${title}</div>
<div class="toast-message">${message}</div>
</div>
`;
container.appendChild(toast);
setTimeout(() => {
toast.style.animation = 'slideOut 0.3s ease';
setTimeout(() => toast.remove(), 300);
}, 3000);
}

function changeSlide(direction) {
const slides = document.querySelectorAll('.carousel-slide');
slides[currentSlide].classList.remove('active');
currentSlide += direction;
if (currentSlide >= slides.length) currentSlide = 0;
if (currentSlide < 0) currentSlide = slides.length - 1;
slides[currentSlide].classList.add('active');
}
setInterval(() => changeSlide(1), 5000);

function updateCartBadge() {
const badge = document.getElementById('cart-badge');
const cartBtn = document.getElementById('cart-btn');
if (cart.length > 0) {
badge.textContent = cart.length;
badge.style.display = 'flex';
} else {
badge.style.display = 'none';
}
cartBtn.classList.add('bounce');
setTimeout(() => cartBtn.classList.remove('bounce'), 500);
}

function addToCart(courseName, price, button) {
if (cart.find(item => item.name === courseName)) {
showToast('Already in cart', courseName + ' is already in your cart', 'error');
return;
}
const originalText = button.textContent;
button.disabled = true;
button.innerHTML = '<span class="spinner"></span> ADDING...';

setTimeout(() => {
cart.push({ name: courseName, price: price, id: Date.now() });
saveCart();
updateCartBadge();
button.disabled = false;
button.textContent = originalText;
showToast('Added to cart!', courseName + ' has been added to your cart', 'success');
}, 500);
}

function removeFromCart(itemId) {
const item = cart.find(i => i.id === itemId);
cart = cart.filter(i => i.id !== itemId);
saveCart();
updateCartBadge();
updateCartDisplay();
showToast('Removed', item.name + ' removed from cart', 'success');
}

function clearCart() {
if (confirm('Are you sure you want to clear your entire cart?')) {
cart = [];
saveCart();
updateCartBadge();
updateCartDisplay();
showToast('Cart cleared', 'All items removed from cart', 'success');
}
}

function updateCartDisplay() {
const cartDisplay = document.getElementById('cart-display');
if (cart.length === 0) {
cartDisplay.innerHTML = '<div class="empty-cart"><h3>Your cart is empty</h3><p>Add courses to get started</p></div>';
return;
}

let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
let discount = 0;
let discountPercent = 0;

if (cart.length === 2) { discountPercent = 5; discount = subtotal * 0.05; }
else if (cart.length === 3) { discountPercent = 10; discount = subtotal * 0.10; }
else if (cart.length > 3) { discountPercent = 15; discount = subtotal * 0.15; }

let afterDiscount = subtotal - discount;
let tax = afterDiscount * 0.15;
let total = afterDiscount + tax;

let html = '<div class="cart-layout"><div class="cart-items-list">';
cart.forEach(item => {
html += `
<div class="cart-item-card">
<div class="cart-item-info">
<h4>${item.name}</h4>
<div class="price">R${item.price.toFixed(2)}</div>
</div>
<button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
</div>
`;
});
html += '</div><div class="cart-summary-box">';
html += `<div class="summary-row"><span>Subtotal:</span><span>R${subtotal.toFixed(2)}</span></div>`;
if (discount > 0) {
html += `<div class="summary-row discount"><span>Discount (${discountPercent}%):</span><span>-R${discount.toFixed(2)}</span></div>`;
}
html += `<div class="summary-row"><span>Tax (15%):</span><span>R${tax.toFixed(2)}</span></div>`;
html += `<div class="summary-row total"><span>TOTAL:</span><span>R${total.toFixed(2)}</span></div>`;
html += '<button class="payment-btn" onclick="showToast(\'Payment\', \'Payment feature coming soon!\', \'success\')">Pay With Card</button>';
html += '<button class="payment-btn" onclick="showToast(\'Payment\', \'Payment feature coming soon!\', \'success\')">Pay With Cash</button>';
html += '<button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>';
html += '</div></div>';
cartDisplay.innerHTML = html;
}

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const courses = [
{ name: 'First Aid', page: 'first-aid', price: 1500 },
{ name: 'Sewing', page: 'sewing', price: 1500 },
{ name: 'Landmetics', page: 'landscaping', price: 1500 },
{ name: 'Life Skills', page: 'life-skills', price: 1500 },
{ name: 'Child Care', page: 'child-minding', price: 750 },
{ name: 'Cooking', page: 'cooking', price: 750 },
{ name: 'Garden Maintenance', page: 'garden-maintenance', price: 750 }
];

searchInput.addEventListener('input', (e) => {
const query = e.target.value.toLowerCase();
if (query.length < 2) {
searchResults.classList.remove('active');
return;
}
const results = courses.filter(c => c.name.toLowerCase().includes(query));
if (results.length > 0) {
searchResults.innerHTML = results.map(c =>
`<div class="search-result-item" onclick="showPage('${c.page}'); searchResults.classList.remove('active'); searchInput.value = '';"><strong>${c.name}</strong><br><small>R${c.price}</small></div>`
).join('');
searchResults.classList.add('active');
} else {
searchResults.innerHTML = '<div class="search-result-item">No courses found</div>';
searchResults.classList.add('active');
}
});

document.addEventListener('click', (e) => {
if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
searchResults.classList.remove('active');
}
});

function showPage(pageId, sourceElement) {
const pages = document.querySelectorAll('.page');
const navBtns = document.querySelectorAll('.nav-btn');
const header = document.getElementById('main-header');
const nav = document.querySelector('nav');
const footer = document.querySelector('footer');

pages.forEach(p => p.classList.remove('active'));
document.getElementById(pageId).classList.add('active');

if (pageId === 'landing') {
header.style.display = 'none';
nav.style.display = 'none';
footer.style.display = 'none';
} else {
header.style.display = 'block';
nav.style.display = 'block';
footer.style.display = 'block';
}

navBtns.forEach(btn => btn.classList.remove('active'));
if (sourceElement) sourceElement.classList.add('active');

if (pageId === 'view-cart') updateCartDisplay();

window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
loadCart();
updateCartBadge();
showPage('landing');
});
/* Code Attribution
   Author: MDN Web Docs Contributors
   Title: localStorage - Web Storage API documentation
   Date Published: 2024
   Link/URL: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   Date Accessed: 2025-10-29
*/

/* Code Attribution
   Author: W3Schools
   Title: JavaScript JSON Parse & Stringify Tutorial
   Date Published: 2023
   Link/URL: https://www.w3schools.com/js/js_json_parse.asp
   Date Accessed: 2025-10-29
*/

/* Code Attribution
   Author: MDN Web Docs Contributors
   Title: setTimeout() and setInterval() Methods
   Date Published: 2024
   Link/URL: https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
   Date Accessed: 2025-10-29
*/

/* Code Attribution
   Author: Bootstrap Team
   Title: Toast Notification UI Concept
   Date Published: 2024
   Link/URL: https://getbootstrap.com/docs/5.3/components/toasts/
   Date Accessed: 2025-10-29
*/

/* Code Attribution
   Author: Udemy
   Title: Shopping Cart Logic Pattern (Push Item + Update UI)
   Date Published: 2024
   Link/URL: https://www.udemy.com/topic/javascript-projects/
   Date Accessed: 2025-10-29
*/

/* Code Attribution
   Author: FreeCodeCamp Contributors
   Title: Filtering Arrays & Search Matching Techniques
   Date Published: 2024
   Link/URL: https://www.freecodecamp.org/news/how-to-use-the-filter-array-method-in-javascript/
   Date Accessed: 2025-10-29
*/

/* Code Attribution
   Author: MDN Web Docs Contributors
   Title: Event Delegation (document.addEventListener)
   Date Published: 2024
   Link/URL: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events
   Date Accessed: 2025-10-29
*/

/* Code Attribution
   Author: Apple Safari WebKit Team
   Title: Smooth Scrolling Behavior
   Date Published: 2024
   Link/URL: https://webkit.org/blog/
   Date Accessed: 2025-10-29
*/

/* Code Attribution
   Author: Stack Overflow Community
   Title: Simple Carousel Slide Index Wrapping Logic
   Date Published: 2023
   Link/URL: https://stackoverflow.com/q/54104741
   Date Accessed: 2025-10-29
*/

/* Code Attribution
   Author: Coursera Front-End Web Development Instructor Team
   Title: DOM InnerHTML Rendering Pattern for Shopping Cart UI
   Date Published: 2024
   Link/URL: https://www.coursera.org/learn/html-css-javascript
   Date Accessed: 2025-10-29
*/

/* Code Attribution
   Author: Google Web Fundamentals
   Title: LocalState UI Sync Best Practices
   Date Published: 2024
   Link/URL: https://web.dev/persistent-storage/
   Date Accessed: 2025-10-29
*/