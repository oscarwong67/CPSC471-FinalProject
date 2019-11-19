var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'cfxpQFeAgl',
  password : '5wLicDMtkr',
  database : 'cfxpQFeAgl'
});
 
connection.connect();
 
// connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });


 
connection.end();