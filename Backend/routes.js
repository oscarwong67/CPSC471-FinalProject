const routes = require('express').Router();
const db = require('./db');
const helper = require('./helper');

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
        success: true,
        accountId: results[0].user_id,
        accountType: results[0].accountType
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
          db.query('INSERT INTO CAR SET ?', { vehicle_id, license_plate, num_seats, make, color }, (error, results) => {
            if (error) { throw error; }
            db.query('INSERT INTO DRIVER SET ?', { user_id, vehicle_id }, (error, results) => {
              if (error) { throw error; }
              res.status(200).json({ success: true, message: 'Success!', 'accountId': user_id, 'accountType': 'Driver' });
            });
          })
        });
      } else if (accountType === "Charger") {
        db.query('INSERT INTO CHARGER SET ?', { user_id }, (error, results) => {
          if (error) { throw error; }
          res.status(200).json({ success: true, message: 'Success!', 'accountId': user_id, 'accountType': 'Charger' });
        });
      } else if (accountType === "Customer") {
        db.query('INSERT INTO CUSTOMER SET ?', { user_id }, (error, results) => {
          if (error) { throw error; }
          res.status(200).json({ success: true, message: 'Success!', 'accountId': user_id, 'accountType': 'Customer' });
        });
      } else {
        console.log("no account type recognized\n");
        res.status(400).json({ success: false, message: 'Failure!' });
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
  const accountID = req.body.accountId;
  db.query('SELECT credit_card FROM CREDIT_CARD WHERE user_id=?' [accountID], (error, results) => {
    if (error) {
      console.log(error);
      res.status(400).json({ message: 'Failure!'});
    } else {
      res.status(200).json({ success: true, message: 'Success!', 'accountId': user_id, 'accountBalance': results.accountBalance });
    }
  });
});

routes.post('/api/rentElectricVehicle'), (req, res) => {
  //  use req.query.accountId and req.query.electricVehicleId?
  const accountID = req.body.accountId;
  const vehicleID = req.body.electricVehicleId;
  db.query('SELECT * FROM ELECTRIC_VEHICLE WHERE vehicle_id=? AND availability=1', [vehicleID], (error, reuslts) => {
    if(error) {
      console.log(error);
      res.status(400).json({message : 'Faliure!'});
    } else if(results.length > 0) {
      const startLat = req.body.startLatitude;
      const startLng = req.body.startLongitude;
      db.query('INSERT INTO TRIP SET ?', {
        pickup_latitude: startLat,
        pickup_longitude: startLng,
        start_time: helper.currentTime(),
        date: helper.currentDate()
      }, (error, results) => {
        if(error) {
          console.log(error);
          res.status(400).json({message: 'Falure!'});
        } else {
          const tripID = results.insertId;
          db.query('UPDATE ELECTRIC_VEHICLE SET availability=0 WHERE vehicle_id=?', [vehicleID]);
          db.query('INSERT INTO TAKES SET ?', {
            Trip_id: tripID,
            user_id: accountID,
            user_who_initiated_trip_id: accountID
          }, (error, results) => {
            if(error) {
              console.log(error);
              res.status(400).json({message: 'Falure!'});
            } else {
              res.status(200).json({ success: true });
            }
          });
        }
      });
    } else {
      res.status(200).json({ success: false, message: 'Sorry, vehicle already rented'});
    }
  });
}

routes.post('/api/bookCarTrip', (req, res) => {
  const userId = req.body.userId;
  const startLat = req.body.startLatitude;
  const startLng = req.body.startLongitude;
  const destLat = req.body.destLatitude;
  const destLng = req.body.destLongitude;
  const distance = helper.calcDistanceKM(startLat, startLng, destLat, destLng);

  db.query('SELECT user_id FROM DRIVER WHERE availability=1', (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      const driverId = results[0].user_id;
      //  create a new trip
      db.query('INSERT INTO TRIP SET ?', {
        pickup_latitude: startLat,
        dest_latitude: destLat,
        pickup_longitude: startLng,
        dest_longitude: destLng,
        distance,
        fare: helper.calcFare(distance),
        start_time: helper.currentTime(),
        // end_time: helper.calcTripEnd(),  // just going to leave this null until customer ends trip 
        date: helper.currentDate()
      }, (error, results) => {
        if (error) throw error;        
        const tripId = results.insertId;
        //  set driver status to unavailable
        db.query('UPDATE DRIVER SET availability=? WHERE user_id=?', [0, driverId], (error, results) => {
          if (error) throw error;
          //  create a new car trip
          db.query('INSERT INTO CAR_TRIP SET ?', {trip_id: tripId, driver_id: driverId}, (error, results) => {
            if (error) throw error;                      
            //  create a "takes" entity
            db.query('INSERT INTO TAKES SET ?', {Trip_id: tripId, user_id: userId, user_who_initiated_trip_id: userId}, (error, results) => {
              if (error) throw error;
              res.status(200).json({ success: true });  
            })
          })
        });
      });
    } else {
      res.status(200).json({ success: false, message: 'Sorry, unable to book Ryde. No available drivers.' });
    }
  })
});

module.exports = routes;