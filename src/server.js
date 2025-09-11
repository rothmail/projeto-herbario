// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db_config'); // seu arquivo db_config.js (mais abaixo)

const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rota GET listar plantas
app.get('/plantas', (req, res) => {
    const sql = `SELECT 
    id,
    nomePopular AS nomePopular,
    nome_cientifico AS nomeCientifico,
    familia_botanica AS familiaBotanica,
    origem AS origem,
    usos_medicinais AS usosMedicinais,
    principios_ativos AS principiosAtivos,
    parte_utilizada AS parteUtilizada,
    modo_preparo AS modoPreparo,
    contraindicacoes AS contraindicacoes,
    imagem AS imagem
    FROM plantas ORDER BY id DESC`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar plantas:', err);
            return res.status(500).json({ erro: 'Erro ao buscar plantas.' });
        }
        res.json(results);
    });
});

// rota POST cadastrar planta
app.post('/plantas', (req, res) => {
    const {
        nomePopular, nomeCientifico, familiaBotanica, origem,
        usosMedicinais, principiosAtivos, parteUtilizada,
        modoPreparo, contraindicacoes, imagem
    } = req.body;

    // validação mínima
    if (!nomePopular || !nomeCientifico) {
        return res.status(400).json({ erro: 'nomePopular e nomeCientifico são obrigatórios.' });
    }

    const sql = `INSERT INTO plantas
    (nome_popular, nome_cientifico, familia_botanica, origem, usos_medicinais, principios_ativos, parte_utilizada, modo_preparo, contraindicacoes, imagem)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        nomePopular, nomeCientifico, familiaBotanica || null, origem || null,
        usosMedicinais || null, principiosAtivos || null, parteUtilizada || null,
        modoPreparo || null, contraindicacoes || null, imagem || null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir planta:', err);
            // detecta violação de unicidade (nome científico)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ erro: 'Já existe planta com esse nome científico.' });
            }
            return res.status(500).json({ erro: 'Erro ao salvar planta.' });
        }
        res.status(201).json({
            id: result.insertId,
            nomePopular,
            nomeCientifico,
            familiaBotanica,
            origem,
            usosMedicinais,
            principiosAtivos,
            parteUtilizada,
            modoPreparo,
            contraindicacoes,
            imagem
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://127.0.0.1:${PORT}/`);
});