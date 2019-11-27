
const mysql = require('mysql');
console.log('Initializing database connection...');

const connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'cfxpQFeAgl',
    password: '5wLicDMtkr',
    database: 'cfxpQFeAgl'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) throw error;
    console.log('If this prints "2", then the database is online and working. ', results[0].solution);
});

module.exports = connection;