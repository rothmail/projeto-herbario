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

async function getData() {
    try {
      const connection = await pool.getConnection(); // Obtém uma conexão do pool
      const [rows] = await connection.execute('SELECT*FROM projeto_herbario'); // Executa a consulta
      connection.release(); // Libera a conexão de volta para o pool
      return rows;
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      throw error;
    }
}

module.exports = connection;