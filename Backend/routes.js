const routes = require('express').Router();
const db = require('./db');
const helper = require('./helper');

routes.get('/api/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.post('/api/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const accountInfo = await db.query('SELECT * FROM USER WHERE Email=? AND Password=?', [email, password]);
    if (!accountInfo.length) throw new Error('Invalid username or password!');
    res.status(200).json({
      success: true,
      accountId: accountInfo[0].user_id,
      accountType: accountInfo[0].accountType
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failure!', success: false });  //  example of error case for HTTP 400 (bad request)
  }
});

routes.post('/api/signup', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const number = req.body.phone;
  const accountType = req.body.accountType;
  try {
    const userResults = await db.query('INSERT INTO USER SET ?', {
      Phone_no: number, Fname: firstName, Lname: lastName, Email: email, Password: password, accountType: accountType
    });
    if (!userResults.insertId) throw new Error('Unable to insert into USER during signup.');
    const user_id = userResults.insertId;
    if (accountType === "Driver") {
      const license_plate = req.body.licensePlate;
      const color = req.body.color;
      const make = req.body.make;
      const num_seats = req.body.seats;

      //  vehicle, then car, then driver
      const vehicleResults = await db.query('INSERT INTO VEHICLE SET vehicle_id=NULL');
      if (!vehicleResults.insertId) throw new Error('Unable to insert into VEHICLE during driver signup.');
      const vehicle_id = vehicleResults.insertId;
      const carResults = await db.query('INSERT INTO CAR SET ?', { vehicle_id, license_plate, num_seats, make, color });
      if (!carResults.affectedRows) { throw Error('Unable to insert into CAR during driver signup.'); }
      const driverResults = await db.query('INSERT INTO DRIVER SET ?', { user_id, vehicle_id });
      if (!driverResults.affectedRows) { throw Error('Unable to insert into DRIVER during driver signup.'); }
      res.status(200).json({ success: true, message: 'Success!', 'accountId': user_id, 'accountType': 'Driver' });
    } else if (accountType === "Charger") {
      const chargerResults = await db.query('INSERT INTO CHARGER SET ?', { user_id });
      if (!chargerResults.affectedRows) { throw new Error('Unable to insert into CHARGER during signup.'); }
      res.status(200).json({ success: true, message: 'Success!', 'accountId': user_id, 'accountType': 'Charger' });
    } else if (accountType === "Customer") {
      const customerResults = await db.query('INSERT INTO CUSTOMER SET ?', { user_id });
      if (!customerResults.affectedRows) { throw new Error('Unable to insert into CUSTOMER during signup.') }
      res.status(200).json({ success: true, message: 'Success!', 'accountId': user_id, 'accountType': 'Customer' });
    } else {
      throw new Error("no account type recognized");
    }
  }
  catch (error) {
    console.log(error);
    res.status(400).json({
      'success': false
    });
  }
});

routes.get('/api/getAccountBalance', async (req, res) => {
  const accountID = req.query.accountId;
  try {
    const results = await db.query('SELECT balance FROM PAYMENT_ACCOUNT WHERE user_id=?', [accountID]);
    if (!results.length) throw new Error(`Unable to fetch account balance for user ${accountID}`);
    res.status(200).json({ success: true, message: 'Success!', 'accountId': accountID, 'accountBalance': results[0].balance });
  } catch (error) {
    console.log(error);
    res.status(400).json({ 'success': false });
  }
});

routes.get('/api/getCustomerCreditCard', async (req, res) => {
  const accountID = req.query.accountId;
  try {
    const results = await db.query('SELECT credit_card FROM CREDIT_CARD WHERE user_id=?', [accountID]);
    if (!results.length) throw new Error(`Unable to fetch credit card for user ${accountID}`);
    res.status(200).json({ success: true, message: 'Success!', 'accountId': accountID, 'credit_card': results[0].credit_card });
  } catch (error) {
    console.log(error);
    res.status(400).json({ 'success': false });
  }
});

routes.post('/api/rentElectricVehicle'), async(req, res) => {
  //  use req.query.accountId and req.query.electricVehicleId?
  const accountID = req.body.accountId;
  const vehicleID = req.body.electricVehicleId;
  try {
    const rentElectricVehicles = await db.query('SELECT * FROM ELECTRIC_VEHICLE WHERE vehicle_id=? AND availability=1', [vehicleID]);
    if (!rentElectricVehicles.length) { throw new Error('Unable to rent electric vehicle'); }
    const startLat = req.body.startLatitude;
    const startLng = req.body.startLongitude;
    
    const tripCreate = await db.query('INSERT INTO TRIP SET ?', { pickup_latitude: startLat, pickup_longitude: startLng, start_time: helper.currentTime(), date: helper.currentDate() });
    if(!tripCreate.affectedRows) { throw new Error('Unable to create trip'); }
    const tripID = tripCreate.insertId;
    
    const updateElectricVehicles = await db.query('UPDATE ELECTRIC_VEHICLE SET availability=0 WHERE vehicle_id=?', [vehicleID]);
    if(!updateElectricVehicles.affectedRows) { throw new Error('Unable to update electric vehicle'); }
    
    const insertTakes = await db.query('INSERT INTO TAKES SET ?', { tripID, accountID, accountID });
    if(!insertTakes.affectedRows) { throw new Error('Unable to create takes'); }
  } catch(error) {
    console.log(error);
    res.status(400).json({ success: false});
  }
});

routes.post('/api/chargeElectricVehicle', async (req, res) => {
  const user_id = req.body.userId;
  const vehicle_id = req.body.vehicle_id;
  const chargePercentage = req.body.percentage;

  db.query('INSERT INTO CHARGES SET ?', { c_user_id: user_id, vehicle_id: vehicle_id, percentage_charged_by: chargePercentage }, (error, results) => {
    if (error) throw error;
    db.query('SELECT battery_percentage FROM ELECTRIC_VEHICLE WHERE vehicle_id=?', [vehicle_id], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const oldPercentage = results[0].battery_percentage;
        const percentage = helper.calcNewPercentage(chargePercentage, oldPercentage);
        db.query('UPDATE ELECTRIC_VEHICLE SET battery_percentage=? WHERE vehicle_id=?', [percentage, vehicle_id], (error, results) => {
          if (error) throw error;
        })
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({ success: false });
      }
    })
  })
});

routes.post('/api/addFunds', (req, res) => {
  const user_id = req.body.userId;
  const amountAdded = req.body.amount;

  db.query('SELECT balance FROM PAYMENT_ACCOUNT WHERE user_id=?', [user_id], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      const oldBalance = results[0].balance;
      const balance = helper.calcNewBalance(amountAdded, oldBalance);
      db.query('UPDATE PAYMENT_ACCOUNT SET balance=? WHERE user_id=?', [balance, user_id], (error, results) => {
        if (error) throw error;
      })
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  })
})

routes.post('/api/withdrawFunds', async (req, res) => {
  const user_id = req.body.userId;
  try{
    const results = await db.query('UPDATE PAYMENT_ACCOUNT SET balance=0 WHERE user_id=?', [user_id]);
    if (! results.affectedRows) {
      throw new Error('failed to withdraw account balance');
    }
    res.status(200).json({ success: true });
  } catch(error) {
    res.status(200).json({ success: false });
  }
})

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
          db.query('INSERT INTO CAR_TRIP SET ?', { trip_id: tripId, driver_id: driverId }, (error, results) => {
            if (error) throw error;
            //  create a "takes" entity
            db.query('INSERT INTO TAKES SET ?', { Trip_id: tripId, user_id: userId, user_who_initiated_trip_id: userId }, (error, results) => {
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

routes.get('/api/getCustomerTripStatus', (req, res) => {
  const userId = req.query.userId;
  db.query('SELECT * FROM CUSTOMER AS C, TAKES AS TA, TRIP AS TR WHERE end_time IS NULL AND C.user_id=TA.user_id AND TA.Trip_id=TR.trip_id AND C.user_id=?',
    [userId], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        res.status(200).json({ success: true, message: 'Trip loaded successfully.', tripId: results[0].trip_id })
      } else {
        res.status(200).json({ success: false, message: 'You are not currently on a trip!' });
      }
    });
});

module.exports = routes;