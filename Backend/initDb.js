var mysql      = require('promise-mysql');
var connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'cfxpQFeAgl',
  password : '5wLicDMtkr',
  database : 'cfxpQFeAgl'
});
 
connection.connect();

connection.query('CREATE TABLE VEHICLE (vehicle_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY)', (error, results, fields) => {
  if (error) throw error;
});

connection.query('CREATE TABLE CAR (vehicle_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, ' + 
                                    'license_plate VARCHAR(8) NOT NULL, ' + 
                                    'num_seats INT NOT NULL, ' +
                                    'make VARCHAR(100), ' +
                                    'color VARCHAR(20) NOT NULL, ' +
                                    'FOREIGN KEY(vehicle_id) REFERENCES VEHICLE(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                      if (error) throw error;
                                    });

connection.query('CREATE TABLE LOCATION (latitude FLOAT NOT NULL, ' +
                                        'longitude FLOAT NOT NULL, ' +
                                        'street VARCHAR(15) NOT NULL, ' +
                                        'city VARCHAR(15) NOT NULL, ' +
                                        'postal_code CHAR(6) NOT NULL, ' +
                                        'house_no INT NOT NULL, ' +
                                        'PRIMARY KEY (latitude, longitude))' , (error, results, fields) => {
                                          if (error) throw error;
                                        });

connection.query('CREATE TABLE ELECTRIC_VEHICLE (vehicle_id INT AUTO_INCREMENT NOT NULL, ' +
                                                'loc_latitude FLOAT NOT NULL, ' +
                                                'loc_longitude FLOAT NOT NULL, ' +
                                                'availability BOOLEAN NOT NULL, ' +
                                                'battery_percentage INT NOT NULL, ' + 
                                                'PRIMARY KEY (vehicle_id, loc_latitude, loc_longitude), ' +
                                                'FOREIGN KEY (vehicle_id) REFERENCES VEHICLE (vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
                                                'FOREIGN KEY (loc_latitude, loc_longitude) REFERENCES LOCATION (latitude, longitude) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                                  if (error) throw error;
                                                });
     
connection.query('CREATE TABLE BIKE (vehicle_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, ' +
                                    'has_basket BOOLEAN NOT NULL, ' + 
                                    'FOREIGN KEY(vehicle_id) REFERENCES ELECTRIC_VEHICLE(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                      if (error) throw error;
                                    });

connection.query('CREATE TABLE SCOOTER (vehicle_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, ' +
                                        'scooter_model INT NOT NULL, ' +
                                        'FOREIGN KEY (vehicle_id) REFERENCES VEHICLE(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                          if (error) throw error;
                                        });

connection.query('CREATE TABLE USER (user_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, ' +
                                    'phone_no VARCHAR(12) NOT NULL, ' +
                                    'fname VARCHAR(15) NOT NULL, ' +
                                    'lname VARCHAR(15) NOT NULL, ' +
                                    'email VARCHAR(30) NOT NULL,' + 
                                    'password VARCHAR(20) NOT NULL, ' +
                                    'accountType VARCHAR(20) NOT NULL)', (error, results, fields) => {
                                      if (error) throw error;
                                    });

connection.query('CREATE TABLE CUSTOMER (user_id INT NOT NULL PRIMARY KEY, ' + 
                                        'customer_rating INT, ' +
                                        'FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                          if (error) throw error;
                                        });

connection.query('CREATE TABLE PAYMENT_ACCOUNT (user_id INT NOT NULL PRIMARY KEY, ' +
                                                'balance FLOAT NOT NULL, ' +
                                                'bank_account INT NOT NULL, ' +
                                                'FOREIGN KEY (user_id) REFERENCES USER (user_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                                  if (error) throw error;
                                                });


connection.query('CREATE TABLE CREDIT_CARD (user_id INT NOT NULL, '+ 
                                            'credit_card INT NOT NULL, ' +
                                            'PRIMARY KEY (user_id, credit_card), ' +
                                            'FOREIGN KEY (user_id) REFERENCES PAYMENT_ACCOUNT (user_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                              if (error) throw error;
                                            });

connection.query('CREATE TABLE CHARGER (user_id INT NOT NULL PRIMARY KEY, ' +
                                        'charge_price_per_percent FLOAT NOT NULL, ' +
                                        'FOREIGN KEY (user_id) REFERENCES USER (user_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                          if (error) throw error;
                                        });

connection.query('CREATE TABLE CHARGES (c_user_id INT NOT NULL, ' +
                                        'vehicle_id INT NOT NULL, ' +
                                        'percentage_charged_by INT NOT NULL, ' +
                                        'PRIMARY KEY (c_user_id, vehicle_id), ' +
                                        'FOREIGN KEY (c_user_id) REFERENCES CHARGER (user_id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
                                        'FOREIGN KEY (vehicle_id) REFERENCES ELECTRIC_VEHICLE (vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                          if (error) throw error;
                                        });

connection.query('CREATE TABLE DRIVER (user_id INT NOT NULL, ' + 
                                      'vehicle_id INT NOT NULL, ' +
                                      'driver_rating INT, ' +
                                      'availability BOOLEAN NOT NULL, ' +
                                      'PRIMARY KEY (user_id, vehicle_id), ' +
                                      'FOREIGN KEY (user_id) REFERENCES USER (user_id) ON DELETE CASCADE ON UPDATE CASCADE, ' + 
                                      'FOREIGN KEY (vehicle_id) REFERENCES CAR(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => { 
                                        if (error) throw error;
                                      });

connection.query('CREATE TABLE TRIP (trip_id INT AUTO_INCREMENT NOT NULL, ' + 
                                      'pickup_latitude FLOAT NOT NULL, ' +
                                      'dest_latitude FLOAT NOT NULL, ' +
                                      'pickup_longitude FLOAT NOT NULL, ' +
                                      'dest_longitude FLOAT NOT NULL, ' +
                                      'distance FLOAT NOT NULL, ' +
                                      'fare FLOAT NOT NULL, ' +
                                      'start_time TIME NOT NULL, ' +
                                      'end_time TIME NOT NULL, ' +
                                      'duration INT NOT NULL, ' +
                                      'date DATE NOT NULL, ' +
                                      'PRIMARY KEY (trip_id, pickup_latitude, dest_latitude, pickup_longitude, dest_longitude), ' +
                                      'FOREIGN KEY (pickup_latitude, pickup_longitude) REFERENCES LOCATION (latitude, longitude) ON DELETE CASCADE ON UPDATE CASCADE,  ' + 
                                      'FOREIGN KEY (dest_latitude, dest_longitude) REFERENCES LOCATION (latitude, longitude) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                        if (error) throw error;
                                      });

  connection.query('CREATE TABLE CAR_TRIP (trip_id INT NOT NULL PRIMARY KEY, ' +
                                          'driver_id INT NOT NULL, ' +
                                          'fuel_used INT NOT NULL, ' +
                                          'cleanup_fee FLOAT NOT NULL, ' +
                                          'FOREIGN KEY (trip_id) REFERENCES TRIP (trip_id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
                                          'FOREIGN KEY (driver_id) REFERENCES DRIVER (user_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                            if (error) throw error;
                                          });

connection.query('CREATE TABLE TAKES (Trip_id INT NOT NULL, ' +
                                      'user_id INT NOT NULL, ' +
                                      'user_who_initiated_trip_id INT NOT NULL, ' +
                                      'PRIMARY KEY (trip_id, user_id), ' +
                                      'FOREIGN KEY (trip_id) REFERENCES TRIP (trip_id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
                                      'FOREIGN KEY (user_id) REFERENCES CUSTOMER(user_id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
                                      'FOREIGN KEY (user_who_initiated_trip_id) REFERENCES CUSTOMER (user_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                        if (error) throw error;
                                      });
connection.end();