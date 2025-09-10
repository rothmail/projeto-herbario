const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'projeto_herbario',
});

connection.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log('MySQL conectado!');
    }
});

module.exports = connection;