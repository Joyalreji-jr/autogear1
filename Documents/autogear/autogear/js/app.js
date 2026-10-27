// ---------- helpers ----------
const $ = s => document.querySelector(s);
const get = k => JSON.parse(localStorage.getItem(k) || '[]');
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const inr = n => '₹' + n.toLocaleString('en-IN');
const esc = s => String(s).replace(/[&<>"]/g, c => '&#' + c.charCodeAt(0) + ';');
const sub = b => b.items.reduce((s, i) => s + i.qty * i.price, 0);
const total = b => Math.round(sub(b) * 1.18);            // price + 18% GST
const allBills = () => [...SEED_BILLS, ...get('ag_bills')];

// close any open modal (close button or click on the dark overlay)
document.addEventListener('click', e => {
  if (e.target.matches('[data-close], .modal')) document.querySelector('.modal.open')?.classList.remove('open');
});

// ---------- customer storefront (index.html) ----------
if ($('#products')) {
  let cat = 'All', q = '', cart = get('ag_cart');

  const thumb = p => p.icon
    ? `<div class="thumb">${p.icon}</div>`
    : `<div class="thumb" style="background:url(${IMG}) ${p.pos}/${p.z}% no-repeat"></div>`;

  function render() {
    const list = PRODUCTS.filter(p => (cat === 'All' || p.cat === cat) &&
      (p.name + p.brand + p.cat).toLowerCase().includes(q));
    $('#cats').innerHTML = ['All', ...CATS]
      .map(c => `<button class="chip ${c === cat ? 'on' : ''}" data-c="${c}">${c}</button>`).join('');
    $('#products').innerHTML = list.map(p => `
      <div class="card prod">${thumb(p)}
        <small>${p.brand} · ${p.cat}</small>
        <h3>${p.name}</h3>
        <div class="price">${inr(p.price)} ${p.old ? `<s>${inr(p.old)}</s>` : ''}</div>
        <small class="ok">In stock (${p.stock})</small>
        <button class="btn" data-add="${p.id}">Add to cart</button>
      </div>`).join('') || '<p>No parts match your search. Try another brand or category.</p>';
  }

  const saveCart = () => {
    set('ag_cart', cart);
    $('#cartCount').textContent = cart.reduce((s, i) => s + i.qty, 0);
  };

  function renderCart() {
    $('#cartBody').innerHTML = cart.length
      ? cart.map((i, n) => `<div class="row"><span>${i.name} × ${i.qty}</span>
          <span>${inr(i.qty * i.price)} <button class="x" data-rm="${n}" aria-label="Remove">✕</button></span></div>`).join('') +
        `<div class="row"><b>Total (incl. 18% GST)</b><b>${inr(total({ items: cart }))}</b></div>
         <form id="checkout" class="form" style="margin-top:14px">
           <input name="customer" placeholder="Your name" required>
           <input name="phone" placeholder="Phone number" required>
           <button class="btn">Place order</button>
         </form>`
      : '<p>Your cart is empty. Add a part from the shop.</p>';
  }

  document.addEventListener('click', e => {
    const d = e.target.dataset;
    if (d.c) { cat = d.c; render(); }
    if (d.brand) { cat = 'All'; q = d.brand.toLowerCase(); $('#q').value = d.brand; render(); }
    if (d.add) {
      const p = PRODUCTS.find(x => x.id == d.add), line = cart.find(x => x.id == p.id);
      line ? line.qty++ : cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
      saveCart();
    }
    if (d.rm) { cart.splice(d.rm, 1); saveCart(); renderCart(); }
    if (e.target.id === 'cartBtn') { renderCart(); $('#cartModal').classList.add('open'); }
  });

  document.addEventListener('submit', e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target)), id = e.target.id;
    if (id === 'heroSearch') location.hash = 'shop';
    if (id === 'checkout') {
      const bill = { no: 'INV-' + (1001 + allBills().length), date: new Date().toISOString().slice(0, 10),
        customer: f.customer, phone: f.phone, items: cart.map(({ name, qty, price }) => ({ name, qty, price })) };
      set('ag_bills', [...get('ag_bills'), bill]);
      cart = []; saveCart();
      $('#cartModal').classList.remove('open');
      alert('Order placed! Your invoice number is ' + bill.no);
    }
    if (id === 'bookForm') {
      set('ag_bookings', [...get('ag_bookings'), f]);
      e.target.reset();
      alert('Service booked. We will call you to confirm.');
    }
  });

  $('#q').oninput = e => { q = e.target.value.toLowerCase(); render(); };
  $('#brandList').innerHTML = [...new Set(PRODUCTS.map(p => p.brand))]
    .map(b => `<a class="brand" href="#shop" data-brand="${b}">${b}</a>`).join('');
  render(); saveCart();
}

// ---------- admin dashboard (admin.html) ----------
function loadAdmin() {
  const bills = allBills(), bookings = get('ag_bookings');

  $('#stats').innerHTML = [
    ['Total sales', inr(bills.reduce((s, b) => s + total(b), 0))],
    ['Bills', bills.length], ['Parts listed', PRODUCTS.length], ['Service bookings', bookings.length]
  ].map(([k, v]) => `<div class="card stat"><small>${k}</small><h2>${v}</h2></div>`).join('');

  $('#billRows').innerHTML = bills.map((b, n) => `<tr><td>${b.no}</td><td>${b.date}</td><td>${esc(b.customer)}</td>
    <td>${inr(total(b))}</td><td><button class="btn ghost" data-view="${n}">View bill</button></td></tr>`).join('');

  $('#bookRows').innerHTML = bookings.map(b => `<tr><td>${b.date}</td><td>${esc(b.name)}</td><td>${esc(b.phone)}</td>
    <td>${esc(b.vehicle)}</td><td>${b.service}</td></tr>`).join('') ||
    '<tr><td colspan="5">No bookings yet. Bookings made on the store appear here.</td></tr>';

  $('#stockRows').innerHTML = PRODUCTS.map(p => `<tr><td>${p.name}</td><td>${p.brand}</td><td>${p.cat}</td>
    <td>${inr(p.price)}</td><td>${p.stock}</td></tr>`).join('');

  document.addEventListener('click', e => {
    if (e.target.dataset.view === undefined) return;
    const b = bills[e.target.dataset.view];
    $('#invoice').innerHTML = `<h2>Invoice ${b.no}</h2>
      <p><small>${b.date} · ${esc(b.customer)} · ${esc(b.phone)}</small></p>
      ${b.items.map(i => `<div class="row"><span>${i.name} × ${i.qty}</span><span>${inr(i.qty * i.price)}</span></div>`).join('')}
      <div class="row"><span>Subtotal</span><span>${inr(sub(b))}</span></div>
      <div class="row"><span>GST 18%</span><span>${inr(total(b) - sub(b))}</span></div>
      <div class="row"><b>Total</b><b>${inr(total(b))}</b></div>
      <p style="margin-top:14px"><button class="btn" onclick="print()">Print bill</button>
      <button class="btn ghost" data-close>Close</button></p>`;
    $('#invoiceModal').classList.add('open');
  });
}

// ---------- admin login (admin.html) ----------
if ($('#loginForm')) {
  const sha = async s => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))]
    .map(b => b.toString(16).padStart(2, '0')).join('');
  const show = () => { $('#login').hidden = true; $('#dash').hidden = false; $('#logout').hidden = false; loadAdmin(); };

  if (sessionStorage.getItem('ag_admin')) show();          // stay logged in until the tab is closed

  $('#loginForm').onsubmit = async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    if (!window.crypto?.subtle) { $('#loginErr').textContent = 'Open this page with Live Server (localhost) to log in.'; return; }
    if (f.user === ADMIN_USER && await sha(f.pass) === ADMIN_HASH) {
      sessionStorage.setItem('ag_admin', '1'); show();
    } else {
      $('#loginErr').textContent = 'Wrong username or password.';
    }
  };
  $('#logout').onclick = () => { sessionStorage.removeItem('ag_admin'); location.reload(); };
}
