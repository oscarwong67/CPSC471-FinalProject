var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'cfxpQFeAgl',
  password : '5wLicDMtkr',
  database : 'cfxpQFeAgl'
});
 
connection.connect();

connection.query('CREATE TABLE VEHICLE (Vehicle_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY)', (error, results, fields) => {
  if (error) throw error;
});

connection.query('CREATE TABLE CAR (Vehicle_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, ' + 
                                    'License_plate VARCHAR(8) NOT NULL, ' + 
                                    'Num_seats INT NOT NULL, ' +
                                    'Make VARCHAR(100), ' +
                                    'Color VARCHAR(20) NOT NULL, ' +
                                    'FOREIGN KEY(Vehicle_id) REFERENCES VEHICLE(Vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                      if (error) throw error;
                                    });

connection.query('CREATE TABLE LOCATION (Latitude FLOAT NOT NULL, ' +
                                        'Longitude FLOAT NOT NULL, ' +
                                        'Street VARCHAR(15) NOT NULL, ' +
                                        'City VARCHAR(15) NOT NULL, ' +
                                        'Postal_code CHAR(6) NOT NULL, ' +
                                        'House_no INT NOT NULL, ' +
                                        'PRIMARY KEY (Latitude, Longitude))' , (error, results, fields) => {
                                          if (error) throw error;
                                        });

connection.query('CREATE TABLE ELECTRIC_VEHICLE (Vehicle_id INT AUTO_INCREMENT NOT NULL, ' +
                                                'Loc_latitude FLOAT NOT NULL, ' +
                                                'Loc_longitude FLOAT NOT NULL, ' +
                                                'Availability BOOLEAN NOT NULL, ' +
                                                'Battery_percentage INT NOT NULL, ' + 
                                                'PRIMARY KEY (Vehicle_id, Loc_latitude, Loc_longitude), ' +
                                                'FOREIGN KEY (Vehicle_id) REFERENCES VEHICLE (Vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
                                                'FOREIGN KEY (Loc_latitude, Loc_longitude) REFERENCES LOCATION (Latitude, Longitude) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                                  if (error) throw error;
                                                });
     
connection.query('CREATE TABLE BIKE (Vehicle_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, ' +
                                    'Has_basket BOOLEAN NOT NULL, ' + 
                                    'FOREIGN KEY(Vehicle_id) REFERENCES ELECTRIC_VEHICLE(Vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                      if (error) throw error;
                                    });

connection.query('CREATE TABLE SCOOTER (Vehicle_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY, ' +
                                        'Scooter_model INT NOT NULL, ' +
                                        'FOREIGN KEY (Vehicle_id) REFERENCES VEHICLE(Vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                          if (error) throw error;
                                        });

connection.query('CREATE TABLE USER (User_id INT NOT NULL PRIMARY KEY, ' +
                                    'Phone_no INT NOT NULL, ' +
                                    'Fname VARCHAR(15) NOT NULL, ' +
                                    'Lname VARCHAR(15) NOT NULL, ' +
                                    'Email VARCHAR(20) NOT NULL)', (error, results, fields) => {
                                      if (error) throw error;
                                    });

connection.query('CREATE TABLE CUSTOMER (User_id INT NOT NULL PRIMARY KEY, ' + 
                                        'Customer_rating INT, ' +
                                        'FOREIGN KEY (User_id) REFERENCES USER(User_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                          if (error) throw error;
                                        });

connection.query('CREATE TABLE EMPLOYEE (User_id INT NOT NULL PRIMARY KEY, ' +
                                        'SSN INT NOT NULL, ' +
                                        'FOREIGN KEY (User_id) REFERENCES USER (User_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                          if (error) throw error;
                                        });

connection.query('CREATE TABLE PAYMENT_ACCOUNT (User_id INT NOT NULL PRIMARY KEY, ' +
                                                'Balance FLOAT NOT NULL, ' +
                                                'Bank_account INT NOT NULL, ' +
                                                'FOREIGN KEY (User_id) REFERENCES USER (User_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                                  if (error) throw error;
                                                });


connection.query('CREATE TABLE CREDIT_CARD (User_id INT NOT NULL, '+ 
                                            'Credit_card INT NOT NULL, ' +
                                            'PRIMARY KEY (User_id, Credit_card), ' +
                                            'FOREIGN KEY (User_id) REFERENCES PAYMENT_ACCOUNT (User_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                              if (error) throw error;
                                            });

connection.query('CREATE TABLE CHARGER (User_id INT NOT NULL PRIMARY KEY, ' +
                                        'Charge_price_per_wh FLOAT NOT NULL, ' +
                                        'FOREIGN KEY (User_id) REFERENCES EMPLOYEE (User_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                          if (error) throw error;
                                        });

connection.query('CREATE TABLE CHARGES (C_User_id INT NOT NULL, ' +
                                        'Vehicle_id INT NOT NULL, ' +
                                        'Percentage_charge_by INT NOT NULL, ' +
                                        'PRIMARY KEY (C_User_id, Vehicle_id), ' +
                                        'FOREIGN KEY (C_User_id) REFERENCES CHARGER (User_id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
                                        'FOREIGN KEY (Vehicle_id) REFERENCES ELECTRIC_VEHICLE (Vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                          if (error) throw error;
                                        });

connection.query('CREATE TABLE DRIVER (User_id INT NOT NULL, ' + 
                                      'Vehicle_id INT NOT NULL, ' +
                                      'Driver_rating INT, ' +
                                      'Availability BOOLEAN NOT NULL, ' +
                                      'PRIMARY KEY (User_id, Vehicle_id), ' +
                                      'FOREIGN KEY (User_id) REFERENCES EMPLOYEE (User_id) ON DELETE CASCADE ON UPDATE CASCADE, ' + 
                                      'FOREIGN KEY (Vehicle_id) REFERENCES CAR(Vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => { 
                                        if (error) throw error;
                                      });

connection.query('CREATE TABLE TRIP (Trip_id INT NOT NULL, ' + 
                                      'Pickup_latitude FLOAT NOT NULL, ' +
                                      'Dest_latitude FLOAT NOT NULL, ' +
                                      'Pickup_longitude FLOAT NOT NULL, ' +
                                      'Dest_longitude FLOAT NOT NULL, ' +
                                      'Distance FLOAT NOT NULL, ' +
                                      'Fare FLOAT NOT NULL, ' +
                                      'Start_time TIME NOT NULL, ' +
                                      'End_time TIME NOT NULL, ' +
                                      'Duration INT NOT NULL, ' +
                                      'Date DATE NOT NULL, ' +
                                      'PRIMARY KEY (Trip_id, Pickup_latitude, Dest_latitude, Pickup_longitude, Dest_longitude), ' +
                                      'FOREIGN KEY (Pickup_latitude, Pickup_longitude) REFERENCES LOCATION (Latitude, Longitude) ON DELETE CASCADE ON UPDATE CASCADE,  ' + 
                                      'FOREIGN KEY (Dest_latitude, Dest_longitude) REFERENCES LOCATION (Latitude, Longitude) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                        if (error) throw error;
                                      });

  connection.query('CREATE TABLE CAR_TRIP (trip_id INT NOT NULL PRIMARY KEY, ' +
                                          'Driver_id INT NOT NULL, ' +
                                          'Fuel_used INT NOT NULL, ' +
                                          'Cleanup_fee FLOAT NOT NULL, ' +
                                          'FOREIGN KEY (trip_id) REFERENCES TRIP (Trip_id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
                                          'FOREIGN KEY (Driver_id) REFERENCES DRIVER (User_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                            if (error) throw error;
                                          });

connection.query('CREATE TABLE TAKES (Trip_id INT NOT NULL, ' +
                                      'User_id INT NOT NULL, ' +
                                      'User_who_initiated_trip_id INT NOT NULL, ' +
                                      'PRIMARY KEY (Trip_id, User_id), ' +
                                      'FOREIGN KEY (Trip_id) REFERENCES TRIP (Trip_id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
                                      'FOREIGN KEY (User_id) REFERENCES CUSTOMER(User_id) ON DELETE CASCADE ON UPDATE CASCADE, ' +
                                      'FOREIGN KEY (User_who_initiated_trip_id) REFERENCES CUSTOMER (User_id) ON DELETE CASCADE ON UPDATE CASCADE)', (error, results, fields) => {
                                        if (error) throw error;
                                      });
connection.end();