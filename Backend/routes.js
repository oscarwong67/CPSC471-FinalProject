const routes = require('express').Router();
const db = require('./db');

routes.get('/api/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.post('/api/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.query('SELECT * FROM USER WHERE Email=? AND Password=?', [email, password], (error, results) => {
    if (error || !results || results.length === 0) {
      if (error) {
        console.log(error);
      }
      res.status(400).json({ message: 'Failure!' });  //  example of error case for HTTP 400 (bad request)
    } else if (results) {
      res.status(200).json({
        'success': true,
        'accountId': results[0].user_id,
        'accountType': results[0].accountType
      });
    }
  });
});

routes.post('/api/signup', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const number = req.body.phone;
  const accountType = req.body.accountType;
  try {
    db.query('INSERT INTO USER SET ?', {
      Phone_no: number, Fname: firstName, Lname: lastName, Email: email, Password: password, accountType: accountType
    }, (error, results) => {
      if (error) { throw error; }

      const user_id = results.insertId;
      if (accountType === "Driver") {
        const license_plate = req.body.licensePlate;
        const color = req.body.color;
        const make = req.body.make;
        const num_seats = req.body.seats;  
        db.query('INSERT INTO VEHICLE SET vehicle_id=NULL', (error, results) => {
          if (error) { throw error; }
          const vehicle_id = results.insertId;
          db.query('INSERT INTO CAR SET ?', {vehicle_id, license_plate, num_seats, make, color}, (error, results) => {
            if (error) throw error;
            db.query('INSERT INTO DRIVER SET ?', {user_id, vehicle_id}, (error, results) => {
              if (error) { throw error; }
              res.status(200).json({message: 'Success!', 'accountId': user_id, 'accountType': 'Driver'});
            });
          })
        });  
      } else if (accountType === "Charger") {
        db.query('INSERT INTO CHARGER SET ?', { user_id }, (error, results) => {
          if (error) { throw error; }
          res.status(200).json({message: 'Success!', 'accountId': user_id, 'accountType': 'Charger'});
        });
      } else if (accountType === "Customer") {
        db.query('INSERT INTO CUSTOMER SET ?', {user_id}, (error, results) => {
          if (error) { throw error; }
          res.status(200).json({message: 'Success!', 'accountId': user_id, 'accountType': 'Customer'});
        });
      } else {
        console.log("no account type recognized\n");
        res.status(400).json({ message: 'Failure!' });
      }
    })
  }
  catch (error) {
    console.log(error);
    res.status(400).json({
      'success': false
    });
  }
});

routes.get('/api/accountBalance', (req, res) => {
  //  use req.query.accountId or smth

  res.json({
    accountId: '-1',
    accountBalance: -1
  });
})

routes.post('/api/rentElectricVehicle'), (req, res) => {
  //  use req.query.accountId and req.query.electricVehicleId?

  if (true) {
    res.status(200).json({
      message: 'Success!'
    })
  } else {
    res.status(400).json({ message: 'Failure.' });
  }
}

module.exports = routes;