const COLORS = {
  'Acción':'#ff6b35','Drama':'#7c3aed','Terror':'#dc2626',
  'Comedia':'#16a34a','Sci-Fi':'#0ea5e9','Animación':'#f59e0b','Thriller':'#6366f1'
};

let posters = [
  {id:'P001',titulo:'Pacific Rim',genero:'Acción',anio:2013,stock:12,min:3,precio:35000,tam:'A2 (42x59cm)',img:'pacific.jpg',badge:'hot'},
  {id:'P002',titulo:'Pulp Fiction',genero:'Thriller',anio:1994,stock:8,min:3,precio:42000,tam:'A1 (59x84cm)',img:'pull.jpg',badge:''},
  {id:'P003',titulo:'Snatch',genero:'Comedia',anio:2000,stock:2,min:3,precio:38000,tam:'A2 (42x59cm)',img:'snach.jpg',badge:''},
  {id:'P004',titulo:'Transformers',genero:'Acción',anio:2007,stock:0,min:3,precio:32000,tam:'A2 (42x59cm)',img:'transfo.jpg',badge:''},
  {id:'P005',titulo:'Spider-Man',genero:'Acción',anio:2018,stock:15,min:3,precio:45000,tam:'A1 (59x84cm)',img:'s-l1200.jpg',badge:'new'},
];

let activeChip = 'Todos';

// ── HELPERS ──────────────────────────────────────────
function stockBadge(s, m) {
  if (s === 0) return `<span class="poster-stock ps-out">Agotado</span>`;
  if (s < m)   return `<span class="poster-stock ps-low">Stock bajo</span>`;
  return `<span class="poster-stock ps-ok">${s} uds</span>`;
}

function fmt(p) {
  return '$' + p.toLocaleString('es-CO');
}

// ── RENDER GRID ───────────────────────────────────────
function renderGrid(containerId, arr) {
  const el = document.getElementById(containerId);
  if (!arr.length) {
    el.innerHTML = `<div style="color:var(--muted);font-size:.85rem;padding:20px">No se encontraron posters.</div>`;
    return;
  }
  el.innerHTML = arr.map(p => `
    <div class="poster-card">
      ${p.badge === 'new' ? '<div class="poster-badge pb-new">NUEVO</div>' : ''}
      ${p.badge === 'hot' ? '<div class="poster-badge pb-hot">🔥 HOT</div>' : ''}
      <div class="poster-img">
        <img src="img/${p.img}" alt="${p.titulo}" onerror="this.src='https://via.placeholder.com/300x450/1c1c22/6b6b7a?text=Sin+imagen'">
        <div class="poster-overlay">
          <button class="pa-del" onclick="del('${p.id}')">Eliminar</button>
        </div>
      </div>
      <div class="poster-info">
        <div class="poster-name">${p.titulo}</div>
        <div class="poster-genre">${p.genero} · ${p.anio}</div>
        <div class="poster-meta">
          <span class="poster-price">${fmt(p.precio)}</span>
          ${stockBadge(p.stock, p.min)}
        </div>
      </div>
    </div>
  `).join('');
}

// ── STATS ─────────────────────────────────────────────
function stats() {
  const v = posters.reduce((a, p) => a + p.precio * p.stock, 0);
  document.getElementById('s-total').textContent = posters.length;
  document.getElementById('s-valor').textContent = '$' + Math.round(v / 1000) + 'K';
  document.getElementById('s-bajo').textContent  = posters.filter(p => p.stock > 0 && p.stock < p.min).length;
  document.getElementById('s-sin').textContent   = posters.filter(p => p.stock === 0).length;
}

// ── CHIPS ─────────────────────────────────────────────
function renderChips() {
  const genres = ['Todos', ...new Set(posters.map(p => p.genero))];
  document.getElementById('chips').innerHTML = genres.map(g => `
    <button class="chip${g === activeChip ? ' active' : ''}" onclick="setChip('${g}',this)">${g}</button>
  `).join('');
}

function setChip(g, btn) {
  activeChip = g;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  filterCat(document.getElementById('search-inp').value);
}

// ── FILTER ────────────────────────────────────────────
function filterCat(q) {
  let arr = posters;
  if (activeChip !== 'Todos') arr = arr.filter(p => p.genero === activeChip);
  if (q) arr = arr.filter(p =>
    p.titulo.toLowerCase().includes(q.toLowerCase()) ||
    p.genero.toLowerCase().includes(q.toLowerCase())
  );
  renderGrid('grid-cat', arr);
}

// ── ALERTS ────────────────────────────────────────────
function buildAlerts() {
  const out = posters.filter(p => p.stock === 0);
  const low = posters.filter(p => p.stock > 0 && p.stock < p.min);
  let h = '';
  out.forEach(p => {
    h += `<div class="alert-item danger">
      <div class="alert-ico">🚨</div>
      <div class="alert-body">
        <div class="alert-title">${p.titulo} (${p.anio})</div>
        <div class="alert-desc">Poster agotado — Reabastecer urgente. Tamaño: ${p.tam}</div>
      </div>
      <div class="alert-chip">Crítico</div>
    </div>`;
  });
  low.forEach(p => {
    h += `<div class="alert-item warn">
      <div class="alert-ico">⚠️</div>
      <div class="alert-body">
        <div class="alert-title">${p.titulo} (${p.anio})</div>
        <div class="alert-desc">Stock: ${p.stock} uds · Mínimo requerido: ${p.min}</div>
      </div>
      <div class="alert-chip">Advertencia</div>
    </div>`;
  });
  if (!h) h = `<div class="alert-item">
    <div class="alert-body">
      <div class="alert-title" style="color:#4ade80">✅ Todo en orden — No hay alertas activas.</div>
    </div>
  </div>`;
  document.getElementById('t-alerts').innerHTML = h;
}

// ── REPORTES ──────────────────────────────────────────
function buildReportes() {
  const genres = {};
  posters.forEach(p => { genres[p.genero] = (genres[p.genero] || 0) + p.stock; });
  const max = Math.max(...Object.values(genres));
  let h = '';
  Object.entries(genres).forEach(([g, v]) => {
    const w = max > 0 ? Math.round(v / max * 100) : 0;
    h += `<div class="bar-row">
      <div class="bar-label">${g}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${w}%;background:${COLORS[g] || '#e63946'}"></div></div>
      <div class="bar-val">${v}</div>
    </div>`;
  });
  document.getElementById('chart-genre').innerHTML = h;
}

// ── MODAL ─────────────────────────────────────────────
function openModal()  { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }

function save() {
  const titulo = document.getElementById('f-titulo').value.trim();
  if (!titulo) { document.getElementById('f-titulo').focus(); return; }

  posters.push({
    id:     'P' + String(posters.length + 1).padStart(3, '0'),
    titulo,
    genero: document.getElementById('f-genero').value,
    anio:   parseInt(document.getElementById('f-anio').value) || 2024,
    stock:  parseInt(document.getElementById('f-stock').value) || 0,
    min:    3,
    precio: parseInt(document.getElementById('f-precio').value) || 0,
    tam:    document.getElementById('f-tam').value,
    img:    document.getElementById('f-img').value.trim() || 'placeholder.jpg',
    badge:  'new'
  });

  refresh();
  closeModal();
  toast('Poster "' + titulo + '" agregado ✅');
  ['f-titulo','f-anio','f-stock','f-precio','f-img'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// ── DELETE ────────────────────────────────────────────
function del(id) {
  const i = posters.findIndex(p => p.id === id);
  if (i < 0) return;
  const nombre = posters[i].titulo;
  posters.splice(i, 1);
  refresh();
  toast('"' + nombre + '" eliminado 🗑️');
}

// ── TOAST ─────────────────────────────────────────────
function toast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── NAVEGACIÓN ────────────────────────────────────────
function go(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  btn.classList.add('active');
  if (id === 'catalogo') { renderGrid('grid-cat', posters); renderChips(); }
  if (id === 'alertas')  buildAlerts();
  if (id === 'reportes') buildReportes();
}

// ── INIT ──────────────────────────────────────────────
function refresh() {
  stats();
  renderGrid('grid-dash', posters);
  renderChips();
}

refresh();