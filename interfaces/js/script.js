const API_BASE =
  location.hostname === "127.0.0.1" || location.hostname === "localhost"
    ? "http://127.0.0.1:3000"
    : "";


document.getElementById('formRegister').addEventListener('submit', function (event) {
  event.preventDefault();
  const nome_popular = document.getElementById('nome_popular').value;
  const nome_cientifico = document.getElementById('nome_cientifico').value;
  const familia_botanica = document.getElementById('familia_botanica').value;
  const origem = document.getElementById('origem').value;
  const uso_medicinal = document.getElementById('uso_medicinal').value;
  const principio_ativo = document.getElementById('principio_ativo').value;
  const parte_utilizada = document.getElementById('parte_utilizada').value;
  const modo_preparo = document.getElementById('modo_preparo').value;
  const imagem = document.getElementById('imagem').value;

  fetch('http://localhost:3030/cadastro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome_popular, nome_cientifico, familia_botanica, origem})
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
        window.location.href = 'login.html';
      } else {
        alert(data.message);
      }
    });
});
const form = document.getElementById("formRegister");
const lista = document.getElementById("plantasLista");
const message = document.getElementById("formMessage");

async function fetchPlantas() {
  try {
    const res = await fetch(`${API_BASE}/plantas`);
    if (!res.ok) throw new Error("Erro ao buscar plantas");
    const plantas = await res.json();
    renderPlantas(plantas);
  } catch (err) {
    lista.innerHTML = `
      <li class="plant-card">
        <div class="meta">
          <p>Não foi possível carregar as plantas. (${err.message})</p>
        </div>
      </li>`;
    console.error(err);
  }
}

function renderPlantas(plantas = []) {
  lista.innerHTML = "";

  if (!plantas.length) {
    lista.innerHTML = `
      <li class="plant-card">
        <div class="meta">
          <p>Nenhuma planta cadastrada.</p>
        </div>
      </li>`;
    return;
  }

  plantas.forEach((p) => {
    const li = document.createElement("li");
    li.className = "plant-card";

    const img = document.createElement("img");
    const metaDiv = document.createElement("div");
    metaDiv.className = "meta";

    const imgSrc =
      p.imagem && p.imagem.startsWith("http")
        ? p.imagem
        : "/placeholder.png";

    img.src = imgSrc;
    img.alt = `Imagem de ${p.nome_popular || "planta"}`;

    const h3 = document.createElement("h3");
    h3.textContent = p.nome_popular || p.nome_cientifico || "—";

    const pCientifico = document.createElement("p");
    pCientifico.innerHTML = "<strong>Nome científico:</strong> ";
    pCientifico.append(p.nome_cientifico || "—");

    const pUso = document.createElement("p");
    pUso.innerHTML = "<strong>Uso:</strong> ";
    const usoText = p.uso_medicinal || p.uso_medicinal || "—";
    pUso.append(shorten(usoText, 80));

    metaDiv.appendChild(h3);
    metaDiv.appendChild(pCientifico);
    metaDiv.appendChild(pUso);

    li.appendChild(img);
    li.appendChild(metaDiv);

    lista.appendChild(li);
  });
}

function shorten(text, n = 60) {
  if (!text) return "";
  return text.length > n ? text.slice(0, n) + "…" : text;
}

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  if (message) message.textContent = "";

  const data = {
    nome_popular: form.nome_popular.value.trim(),
    nome_cientifico: form.nome_cientifico.value.trim(),
    familia_botanica: form.familia_botanica.value.trim(),
    origem: form.origem.value.trim(),
    uso_medicinal: form.uso_medicinal.value.trim(),
    principio_ativo: form.principio_ativo.value.trim(),
    parte_utilizada: form.parte_utilizada.value.trim(),
    modo_preparo: form.modo_preparo.value.trim(),
    contraindicacao: form.contraindicacao.value.trim(),
    imagem: form.imagem.value.trim(),
  };

  if (!data.nome_popular || !data.nome_cientifico) {
    message.textContent =
      'Por favor preencha "Nome Popular" e "Nome Científico".';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/plantas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Erro" }));
      throw new Error(err.erro || err.message || "Erro ao cadastrar");
    }

    const saved = await res.json();
    message.textContent = `Planta cadastrada: ${saved.nome_popular || "—"}`;

    form.reset();
    await fetchPlantas();
  } catch (err) {
    console.error(err);
    message.textContent = `Erro: ${err.message}`;
  }
});

fetchPlantas();