// importar pacotes para aplicação
const express = require('express');
const cors = require('cors');
const db = require('./db_config');

// definir a porta e instanciar o express
const app = express();

// habilitando o cors e a utilização do json
app.use(cors());
app.use(express.json());

// rota GET para listar plantas
app.get('/plantas', (req, res) => {
    const sql = 'SELECT id, nomePopular, nomeCientifico, usoMedicinal, modoPreparo, contraindicacao FROM plantas';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar plantas:', err);
            return res.status(500).json({ erro: 'Erro ao buscar por plantas no banco de dados.' });
        }
        res.json(results);
    });
});

// rota POST para cadastrar planta
app.post('/plantas', (req, res) => {
    const { nomePopular, nomeCientifico, familiaBotanica, origem, usoMedicinal, principioAtivo, parteUtilizada, modoPreparo } = req.body;
    const sql = 'INSERT INTO plantas (nomePopular, nomeCientifico, familiaBotanica, origem, usoMedicinal, principioAtivo, parteUtilizada, modoPreparo, contraindicacao, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [nomePopular, nomeCientifico, familiaBotanica, origem, usoMedicinal, principioAtivo, parteUtilizada, modoPreparo], (err, result) => {
        if (err) {
            console.error('Erro ao coletar planta:', err);
            return res.status(500).json({ erro: 'Erro ao adicionar planta ao herbário.' });
        }
        res.json({
            id: result.insertId,
            nomePopular,
            nomeCientifico,
            origem,
            usoMedicinal,
            principioAtivo,
            parteUtilizada,
            modoPreparo
        });
    });
});

app.post('/plantas', (req, res) => {
    const { nomePopular, nomeCientifico, familiaBotanica, origem, usoMedicinal, principioAtivo, parteUtilizada, modoPreparo } = req.body;
    const sql = 'INSERT INTO plantas (nomePopular, nomeCientifico, familiaBotanica, origem, usoMedicinal, principioAtivo, parteUtilizada, modoPreparo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [nomePopular, nomeCientifico, familiaBotanica, origem, usoMedicinal, principioAtivo, parteUtilizada, modoPreparo], (err, result) => {
        if (err) {
            console.error('Erro ao coletar planta', err);
            res.status(500).json({ erro: 'Erro ao salvar planta no banco de dados.' });
        } else {
            res.json({
                id: result.insertId,
                nomePopular: nomePopular,
                nomeCientifico: nomeCientifico,
                origem: origem,
                usoMedicinal: usoMedicinal,
                principioAtivo: principioAtivo,
                parteUtilizada: parteUtilizada,
                modoPrepar: modoPreparo
            });
        }
    });
});

// subir servidor
app.listen(5500, () => {
    console.log('Servidor rodando em http://127.0.0.1:5500/')
});