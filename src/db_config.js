// db_config.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'projeto_herbario',
    multipleStatements: false
});

connection.connect((err) => {
    if (err) {
        console.error('Erro conexão MySQL:', err);
        process.exit(1);
    } else {
        console.log('MySQL conectado!');
    }
});

module.exports = connection;