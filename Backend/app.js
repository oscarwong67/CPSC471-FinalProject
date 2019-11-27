const express = require('express');
const path = require('path')
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'cfxpQFeAgl',
    password: '5wLicDMtkr',
    database: 'cfxpQFeAgl'
});

connection.connect();

const app = express();

connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) throw error;
    console.log('If this prints "2", then the database is online and working. ', results[0].solution);
});

app.get('/api/test', (req, res) => {
    res.json({
        'Key': 'Value'
    });
})

app.listen(5000)
console.log('Server running on port 5000')