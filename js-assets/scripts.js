function clearCart() {
  if (confirm('Are you sure you want to clear your entire cart?')) {
    cart = [];
    saveCart();
    updateCartBadge();
    updateCartDisplay();
    showToast('Cart cleared', 'All items removed from cart', 'success');
  }
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
