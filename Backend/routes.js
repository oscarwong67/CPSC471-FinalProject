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

routes.get('/api/accountBalance', async (req, res) => {
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

routes.post('/api/rentElectricVehicle', async (req, res) => {
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
  try {
    const insertCharges = await db.query('INSERT INTO CHARGES SET ?', { c_user_id: user_id, vehicle_id: vehicle_id, percentage_charged_by: chargePercentage });
    if (!insertCharges.affectedRows) { throw new Error('Unable to insert into charges'); }
    
    const selectElectricVehicleCharging = await db.query('SELECT battery_percentage FROM ELECTRIC_VEHICLE WHERE vehicle_id=?', [vehicle_id] );
    if (!selectElectricVehicleCharging.length) { throw new Error('Unable to select electric vehicle to charge'); }
      
    const oldPercentage = selectElectricVehicleCharging.battery_percentage;
    const percentage = helper.calcNewPercentage(chargePercentage, oldPercentage);

    const updateElectricVehiclePercent = await db.query('UPDATE ELECTRIC_VEHICLE SET battery_percentage=? WHERE vehicle_id=?', [percentage, vehicle_id]);
    if (!updateElectricVehiclePercent.affectedRows) { throw new Error('Unable to update electric vehicle percentage'); }

    //  TODO: add funds to chargers account

    res.status(200).json({ success: true});
  } catch(error) {
    console.log(error);
    res.status(400).json({ success: false});
  }
});

routes.post('/api/bookCarTrip', async (req, res) => {
  const userId = req.body.userId;
  const startLat = req.body.startLatitude;
  const startLng = req.body.startLongitude;
  const destLat = req.body.destLatitude;
  const destLng = req.body.destLongitude;
  const distance = helper.calcDistanceKM(startLat, startLng, destLat, destLng);

  try {
    const selectAvailableDriver = await db.query('SELECT user_id FROM DRIVER WHERE availability=1');
    if (!selectAvailableDriver.length) { throw new Error('Unable to find find available vehicle'); }
    const driverId = selectAvailableDriver.user_id;
    //  create a new trip
    const createTrip = await db.query('INSERT INTO TRIP SET ?', {
      pickup_latitude: startLat,
      dest_latitude: destLat,
      pickup_longitude: startLng,
      dest_longitude: destLng,
      distance,
      fare: helper.calcFare(distance),
      start_time: helper.currentTime(),
      // end_time: helper.calcTripEnd(),  // just going to leave this null until customer ends trip 
      date: helper.currentDate()
    });
    if (!createTrip.affectedRows) { throw new Error('Unable to create trip'); }
    const tripId = results.insertId;
    //  set driver status to unavailable
    const updateDriver = await db.query('UPDATE DRIVER SET availability=0 WHERE user_id=?', [driverId]);
    if (!updateDriver.affectedRows) { throw new Error('Unable to update drivers status'); }
    //  create a new car trip
    const createCarTrip = await db.query('INSERT INTO CAR_TRIP SET ?', { trip_id: tripId, driver_id: driverId });
    if (!createCarTrip.affectedRows) { throw new Error('Unable to create car trip'); }
    //  create a "takes" entity
    const createTakes = await db.query('INSERT INTO TAKES SET ?', { Trip_id: tripId, user_id: userId, user_who_initiated_trip_id: userId });
    if (!createTakes.affectedRows) { throw new Error('Unable to create takes'); }
    res.status(200).json({ success: true });  
  } catch(error) {
    console.log(error);
    res.status(400).json({ success: false});
  }
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