const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',          
  user: 'root',               
  password: 'AdminasKietas69',               
  database: 'eventsapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
};

const pool = mysql.createPool(dbConfig).promise();

pool.getConnection()
  .then(conn => {
    console.log('Connected to the database');
    conn.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

module.exports = pool;
