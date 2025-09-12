// server.js
const express = require('express');
const cors = require('cors');
// MUDANÇA: Importamos a conexão única do nosso arquivo de configuração
const connection = require('./db_config');

const app = express();
const PORT = 5500;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Rotas da API ---

// ROTA GET: Listar todas as plantas
app.get('/plantas', (req, res) => {
    const sql = "SELECT * FROM plantas ORDER BY nome_popular ASC";

    // Usamos a variável 'connection' importada para todas as queries
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar plantas:', err);
            return res.status(500).json({ erro: 'Erro interno no servidor ao buscar plantas.' });
        }
        res.status(200).json(results);
    });
});

// ROTA POST: Cadastrar uma nova planta
app.post('/plantas', (req, res) => {
    const {
        nome_popular, nome_cientifico, familia_botanica, origem,
        uso_medicinal, principio_ativo, parte_utilizada,
        modo_preparo, contraindicacao, imagem
    } = req.body;

    if (!nome_popular || !nome_cientifico) {
        return res.status(400).json({ erro: '"Nome Popular" e "Nome Científico" são obrigatórios.' });
    }

    const sql = `INSERT INTO plantas 
    (nome_popular, nome_cientifico, familia_botanica, origem, uso_medicinal, principio_ativo, parte_utilizada, modo_preparo, contraindicacao, imagem) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        nome_popular, nome_cientifico, familia_botanica || null, origem || null,
        uso_medicinal || null, principio_ativo || null, parte_utilizada || null,
        modo_preparo || null, contraindicacao || null, imagem || null
    ];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir planta:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ erro: 'Já existe uma planta com esse nome científico.' });
            }
            return res.status(500).json({ erro: 'Erro interno no servidor ao salvar a planta.' });
        }
        
        const novaPlanta = {
            id: result.insertId,
            ...req.body
        };
        res.status(201).json(novaPlanta);
    });
});

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://127.0.0.1:${PORT}/`);
});