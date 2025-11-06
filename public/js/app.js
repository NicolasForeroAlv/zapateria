async function fetchProducts() {
  const res = await fetch('/api/products');
  const data = await res.json();
  return data;
}

function currency(n){ return new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP'}).format(n); }

function renderProducts(products) {
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
      <div class="card h-100">
        <img src="${p.image}" class="card-img-top" style="height:220px;object-fit:cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text flex-grow-1">${p.description}</p>
          <p class="mb-2"><strong>${currency(p.price)}</strong></p>
          <div class="d-flex justify-content-between align-items-center">
            <input type="number" min="1" value="1" class="form-control me-2 qty-input" style="width:90px;">
            <button class="btn btn-primary btn-add" data-id="${p.id}">Agregar</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  document.querySelectorAll('.btn-add').forEach(btn=>{
    btn.addEventListener('click', async (e)=>{
      const id = btn.getAttribute('data-id');
      const qtyInput = btn.parentElement.querySelector('.qty-input');
      const quantity = Number(qtyInput.value) || 1;
      const res = await fetch('/api/cart/add', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ id, quantity })
      });
      const json = await res.json();
      if (json.error) {
        showToast(json.error, 'danger');
      } else {
        showToast('Producto agregado al carrito', 'success');
      }
    });
  });
}

function showToast(message, type='success') {
  const toastEl = document.getElementById('liveToast');
  toastEl.querySelector('.toast-body').textContent = message;
  const toast = new bootstrap.Toast(toastEl);
  toastEl.classList.remove('text-bg-danger','text-bg-success');
  toastEl.classList.add(type==='success' ? 'text-bg-success' : 'text-bg-danger');
  toast.show();
}

document.getElementById('searchForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('searchName').value.toLowerCase();
  const min = Number(document.getElementById('priceMin').value) || 0;
  const max = Number(document.getElementById('priceMax').value) || 999999999;
  const products = await fetchProducts();
  const filtered = products.filter(p=>{
    const matchesName = p.name.toLowerCase().includes(name);
    const matchesPrice = p.price >= min && p.price <= max;
    return matchesName && matchesPrice;
  });
  renderProducts(filtered);
});

// initial load
fetchProducts().then(renderProducts);