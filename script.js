const products = [
  {id:'P001',name:'Laptop Dell Inspiron',cat:'Electrónica',stock:12,min:5,price:2800000,prov:'Dell Colombia'},
  {id:'P002',name:'Mouse Inalámbrico',cat:'Electrónica',stock:45,min:10,price:85000,prov:'Logitech SAS'},
  {id:'P003',name:'Resma Papel A4',cat:'Papelería',stock:3,min:20,price:18000,prov:'Papelería Central'},
  {id:'P004',name:'Tóner Impresora HP',cat:'Electrónica',stock:0,min:3,price:320000,prov:'HP Inc.'},
  {id:'P005',name:'Taladro Percutor',cat:'Herramientas',stock:8,min:4,price:245000,prov:'Makita Colombia'},
  {id:'P006',name:'Detergente Industrial',cat:'Limpieza',stock:30,min:10,price:25000,prov:'Procter & Gamble'},
  {id:'P007',name:'Cuadernos 100h',cat:'Papelería',stock:4,min:15,price:8500,prov:'Norma S.A.'},
  {id:'P008',name:'Cable HDMI 2m',cat:'Electrónica',stock:22,min:8,price:32000,prov:'Generic Tech'},
];

// ── HELPERS ──────────────────────────────────────────
function statusBadge(stock, min) {
  if (stock === 0)    return '<span class="badge badge-out">Sin Stock</span>';
  if (stock < min)    return '<span class="badge badge-low">Stock Bajo</span>';
  return '<span class="badge badge-ok">Disponible</span>';
}

function fmtPrice(p) {
  return '$' + p.toLocaleString('es-CO');
}

function nextId() {
  return 'P' + String(products.length + 1).padStart(3, '0');
}

// ── STATS ─────────────────────────────────────────────
function updateStats() {
  const total = products.length;
  const valor = products.reduce((a, p) => a + p.price * p.stock, 0);
  const bajo  = products.filter(p => p.stock > 0 && p.stock < p.min).length;
  const sin   = products.filter(p => p.stock === 0).length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-valor').textContent = fmtPrice(valor);
  document.getElementById('stat-bajo').textContent  = bajo;
  document.getElementById('stat-sin').textContent   = sin;
}

// ── DASHBOARD TABLE ───────────────────────────────────
function renderTable(data) {
  document.getElementById('table-body').innerHTML = data.map(p => `
    <tr>
      <td class="muted">${p.id}</td>
      <td style="font-weight:500">${p.name}</td>
      <td><span class="badge badge-cat">${p.cat}</span></td>
      <td style="font-weight:600">${p.stock}</td>
      <td>${fmtPrice(p.price)}</td>
      <td>${statusBadge(p.stock, p.min)}</td>
      <td>
        <button class="action-btn" onclick="deleteProduct('${p.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function filterTable(val) {
  const q = val.toLowerCase();
  renderTable(products.filter(p =>
    p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
  ));
}

// ── INVENTARIO ────────────────────────────────────────
function renderInventario() {
  document.getElementById('inv-count').textContent = products.length + ' productos';
  document.getElementById('inv-body').innerHTML = products.map(p => `
    <tr>
      <td class="muted">${p.id}</td>
      <td style="font-weight:500">${p.name}</td>
      <td><span class="badge badge-cat">${p.cat}</span></td>
      <td style="font-weight:600">${p.stock}</td>
      <td class="muted">${p.min}</td>
      <td>${fmtPrice(p.price)}</td>
      <td class="muted">${p.prov}</td>
      <td>${statusBadge(p.stock, p.min)}</td>
      <td>
        <button class="action-btn" onclick="deleteProduct('${p.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

// ── ALERTAS ───────────────────────────────────────────
function renderAlerts() {
  const out = products.filter(p => p.stock === 0);
  const low = products.filter(p => p.stock > 0 && p.stock < p.min);
  let html = '';

  out.forEach(p => {
    html += `
      <div class="alert-item danger">
        <div class="alert-dot danger"></div>
        <div class="alert-text">
          <strong>${p.name} — SIN STOCK</strong>
          Reabastecimiento urgente. Stock: 0 / Mínimo: ${p.min}
        </div>
        <span class="alert-time">Crítico</span>
      </div>`;
  });

  low.forEach(p => {
    html += `
      <div class="alert-item warn">
        <div class="alert-dot warn"></div>
        <div class="alert-text">
          <strong>${p.name} — Stock Bajo</strong>
          Stock actual: ${p.stock} / Mínimo requerido: ${p.min}
        </div>
        <span class="alert-time">Advertencia</span>
      </div>`;
  });

  if (!html) {
    html = `<div class="alert-item">
      <div class="alert-text" style="color:var(--accent)">
        ✅ Todos los productos tienen stock adecuado.
      </div>
    </div>`;
  }

  document.getElementById('alerts-list').innerHTML = html;
}

// ── REPORTES ──────────────────────────────────────────
function renderReportes() {
  const cats = {};
  products.forEach(p => {
    cats[p.cat] = (cats[p.cat] || 0) + p.stock;
  });
  const max = Math.max(...Object.values(cats));
  const colors = ['var(--accent)','var(--accent2)','var(--warn)','var(--danger)','#a855f7'];
  let html = '';
  Object.entries(cats).forEach(([cat, val], i) => {
    const pct = max > 0 ? Math.round((val / max) * 100) : 0;
    html += `
      <div class="bar-row">
        <div class="bar-label">${cat}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${colors[i % colors.length]}"></div></div>
        <div class="bar-val">${val}</div>
      </div>`;
  });
  document.getElementById('chart-cats').innerHTML = html;
}

// ── MODAL ─────────────────────────────────────────────
function openModal()  { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }

function addProduct() {
  const name  = document.getElementById('f-nombre').value.trim();
  const cat   = document.getElementById('f-cat').value;
  const stock = parseInt(document.getElementById('f-stock').value)  || 0;
  const price = parseInt(document.getElementById('f-precio').value) || 0;
  const prov  = document.getElementById('f-prov').value.trim() || 'Sin proveedor';

  if (!name) { document.getElementById('f-nombre').focus(); return; }

  products.push({ id: nextId(), name, cat, stock, min: 5, price, prov });

  renderTable(products);
  updateStats();
  closeModal();
  showToast('Producto "' + name + '" guardado ✅');

  ['f-nombre','f-stock','f-precio','f-prov'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function deleteProduct(id) {
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return;
  const name = products[idx].name;
  products.splice(idx, 1);
  renderTable(products);
  renderInventario();
  updateStats();
  showToast('Producto "' + name + '" eliminado 🗑️');
}

// ── TOAST ─────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── NAVEGACIÓN ────────────────────────────────────────
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  btn.classList.add('active');

  if (id === 'inventario') renderInventario();
  if (id === 'alertas')    renderAlerts();
  if (id === 'reportes')   renderReportes();
}

// ── INIT ──────────────────────────────────────────────
renderTable(products);
updateStats();
