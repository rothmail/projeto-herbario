// Enviar formulário via POST
document.getElementById('formRegister').addEventListener('submit', async (e) => {
    e.preventDefault();

    const namePopular = document.getElementById('nomePopular').value;
    const nomeCientifico = document.getElementById('nomeCientifico').value;
    const familiaBotanica = document.getElementById('familiaBotanica').value;
    const origem = document.getElementById('origem').value;
    const usoMedicinal = document.getElementById('usoMedicinal').value;
    const principioAtivo = document.getElementById('principioAtivo').value;
    const parteUtilizada = document.getElementById('parteUtilizada').value;
    const modoPreparo = document.getElementById('modoPreparo').value;
    const contraindicacao = document.getElementById('contraindicacao').value;
    const imagem = document.getElementById('imagem').value;

    const resp = await fetch("http://127.0.0.1:5500/plantas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, hash_password: hash_password, phone })
    });

    const data = await resp.json();
    alert('Planta cadastrado: ' + data.name);

    uploadPlantas();
});

// Listar Plantas via GET
async function uploadPlantas() {
    const res = await fetch('http://127.0.0.1:5500/Plantas');
    const plantas = await res.json();

    const list = document.getElementById('plantasList');
    list.innerHTML = '';

    plantas.forEach(u => {
        const li = document.createElement('li');
        li.textContent = `${u.id} - ${u.name} (${u.email})`;
        list.appendChild(li);
    });
}

uploadPlantas();