// Enviar formulário via POST
document.getElementById('formRegister').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const hash_password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;

    const resp = await fetch("http://127.0.0.1:5502/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, hash_password: hash_password, phone })
    });

    const data = await resp.json();
    alert('Usuário cadastrado: ' + data.name);

    uploadUsers();
});

// Listar usuários via GET
async function uploadUsers() {
    const res = await fetch('http://127.0.0.1:5502/users');
    const users = await res.json();

    const list = document.getElementById('usersList');
    list.innerHTML = '';

    users.forEach(u => {
        const li = document.createElement('li');
        li.textContent = `${u.id} - ${u.name} (${u.email})`;
        list.appendChild(li);
    });
}

uploadUsers();