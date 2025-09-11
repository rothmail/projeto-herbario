// script.js - cliente
const API_BASE = location.hostname === '127.0.0.1' || location.hostname === 'localhost'
  ? 'http://127.0.0.1:5500'
  : ''; // se for publicado no mesmo host, use relativo

const form = document.getElementById('formRegister');
const lista = document.getElementById('plantasLista');
const message = document.getElementById('formMessage');

async function fetchPlantas() {
  try {
    const res = await fetch(`${API_BASE}/plantas`);
    if (!res.ok) throw new Error('Erro ao buscar plantas');
    const plantas = await res.json();
    renderPlantas(plantas);
  } catch (err) {
    lista.innerHTML = `<li class="plant-card"><div class="meta"><p>Não foi possível carregar as plantas. (${err.message})</p></div></li>`;
    console.error(err);
  }
}

function renderPlantas(plantas = []) {
  lista.innerHTML = '';
  if (!plantas.length) {
    lista.innerHTML = `<li class="plant-card"><div class="meta"><p>Nenhuma planta cadastrada.</p></div></li>`;
    return;
  }

  plantas.forEach(p => {
    const li = document.createElement('li');
    li.className = 'plant-card';
    const imgSrc = p.imagem && p.imagem.startsWith('http') ? p.imagem : './interfaces/img/placeholder.png';
    li.innerHTML = `
      <img src="${imgSrc}" alt="Imagem de ${escapeHtml(p.nomePopular || p.nome_popular || 'planta')}">
      <div class="meta">
        <h3>${escapeHtml(p.nomePopular || p.nome_popular || p.nome_cientifico || '—')}</h3>
        <p><strong>Nome científico:</strong> ${escapeHtml(p.nomeCientifico || p.nome_cientifico || '—')}</p>
        <p><strong>Uso:</strong> ${shorten(escapeHtml(p.usosMedicinais || p.usos_medicinais || p.usoMedicinal || '—'), 80)}</p>
      </div>
    `;
    lista.appendChild(li);
  });
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function shorten(text, n = 60) {
  if (!text) return '';
  return text.length > n ? text.slice(0, n) + '…' : text;
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  message.textContent = '';
  const data = {
    nome_popular: form.nomePopular.value.trim(),
    nome_cientifico: form.nomeCientifico.value.trim(),
    familia_botanica: form.familiaBotanica.value.trim(),
    origem: form.origem.value.trim(),
    usos_medicinais: form.usosMedicinais.value.trim(),
    principios_ativos: form.principiosAtivos.value.trim(),
    parte_utilizada: form.parteUtilizada.value.trim(),
    modo_preparo: form.modoPreparo.value.trim(),
    contraindicacoes: form.contraindicacoes.value.trim(),
    imagem: form.imagem.value.trim()
  };

  // validação simples
  if (!data.nome_popular || !data.nome_cientifico) {
    message.textContent = 'Por favor preencha "Nome Popular" e "Nome Científico".';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/plantas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Erro' }));
      throw new Error(err.erro || err.message || 'Erro ao cadastrar');
    }
    const saved = await res.json();
    message.textContent = `Planta cadastrada: ${saved.nomePopular || saved.nome_popular || '—'}`;
    form.reset();
    // atualizar lista local (prefira refazer a requisição)
    await fetchPlantas();
  } catch (err) {
    console.error(err);
    message.textContent = `Erro: ${err.message}`;
  }
});

// acessibilidade do menu simples
document.getElementById('navToggle')?.addEventListener('click', function () {
  const nav = document.getElementById('mainNav');
  const expanded = this.getAttribute('aria-expanded') === 'true';
  this.setAttribute('aria-expanded', String(!expanded));
  nav.style.display = expanded ? '' : 'flex';
});

// inicializa
fetchPlantas();