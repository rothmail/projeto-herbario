// importar pacotes para aplicação
const express = require('express');
const cors = require('cors');
const db = require('./db_config');

// definir a porta e instanciar o express
const app = express();

// habilitando o cors e a utilização do json
app.use(cors());
app.use(express.json());

// rota GET para listar usuários
app.get('/users', (req, res) => {
    const sql = 'SELECT id, name, email, profile_status, profile_role FROM users';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ erro: 'Erro ao buscar por usuários no banco de dados.' });
        }
        res.json(results);
    });
});

// rota POST para cadastrar usuário
app.post('/users', (req, res) => {
    const { name, email, hash_password, phone } = req.body;
    const sql = 'INSERT INTO users (name, email, hash_password, phone) VALUES (?, ?, ?, ?)';

    db.query(sql, [name, email, hash_password, phone], (err, result) => {
        if (err) {
            console.error('Erro ao inserir usuário:', err);
            return res.status(500).json({ erro: 'Erro ao salvar usuário no banco de dados.' });
        }
        res.json({
            id: result.insertId,
            name,
            email,
            phone
        });
    });
});

app.post('/users', (req, res) => {
    const { name, email, hash_password, phone } = req.body;
    const sql = 'INSERT INTO users (name, email, hash_password, phone) VALUES (?, ?, ?, ?)';

    db.query(sql, [name, email, hash_password, phone], (err, result) => {
        if (err) {
            console.error('Erro ao inserir usuário', err);
            res.status(500).json({ erro: 'Erro ao salvar usuário no banco de dados.' });
        } else {
            res.json({
                id: result.insertId,
                name: name,
                email: email,
                phone: phone,
            });
        }
    });
});

// subir servidor
app.listen(5502, () => {
    console.log('Servidor rodando em http://127.0.0.1:5502/')
});