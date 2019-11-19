var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'cfxpQFeAgl',
  password : '5wLicDMtkr',
  database : 'cfxpQFeAgl'
});
 
connection.connect();
 
connection.query('CREATE TABLE VEHICLE (Vehicle_id INT NOT NULL, PRIMARY KEY (Vehicle_id), UNIQUE(Vehicle_id))', (error, results, fields) => {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();