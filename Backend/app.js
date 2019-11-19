let Koa = require('Koa')
let cors = require('koa-cors')
let bodyparser = require('koa-bodyparser')
var path = require('path')
let autoRoutes = require('koa-auto-routes')
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'cfxpQFeAgl',
    password: '5wLicDMtkr',
    database: 'cfxpQFeAgl'
});

connection.connect();

let app = new Koa()

connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) throw error;
    console.log('If this prints "2", then the database is online and working. ', results[0].solution);
});

app
    .use(cors())
    .use(bodyparser())

autoRoutes(app, path.join(__dirname, 'routers'))

app.listen(5000)
console.log('Server running on port 5000')