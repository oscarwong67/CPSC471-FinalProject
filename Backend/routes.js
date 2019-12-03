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
    res.status(400).json({ 'success': false });
  }
});

routes.post('/api/rentElectricVehicle', async (req, res) => {
  //  use req.query.accountId and req.query.electricVehicleId?
  const user_id = req.body.accountId;
  const vehicleID = req.body.electricVehicleId;
  try {
    const rentElectricVehicles = await db.query('SELECT * FROM ELECTRIC_VEHICLE WHERE vehicle_id=? AND availability=1', [vehicleID]);
    if (!rentElectricVehicles.length) { throw new Error('Unable to rent electric vehicle'); }
    const startLat = rentElectricVehicles[0].loc_latitude;
    const startLng = rentElectricVehicles[0].loc_longitude;

    const tripCreate = await db.query('INSERT INTO TRIP SET ?', {
      pickup_latitude: startLat, pickup_longitude: startLng, start_time: helper.currentTime(), date: helper.currentDate()
    });
    if (!tripCreate.affectedRows) { throw new Error('Unable to create trip'); }
    const trip_id = tripCreate.insertId;

    const updateElectricVehicles = await db.query('UPDATE ELECTRIC_VEHICLE SET availability=0 WHERE vehicle_id=?', [vehicleID]);
    if (!updateElectricVehicles.affectedRows) { throw new Error('Unable to update electric vehicle'); }

    const insertTakes = await db.query('INSERT INTO TAKES SET ?', { trip_id, user_id, user_who_initiated_trip_id: user_id });
    if (!insertTakes.affectedRows) { throw new Error('Unable to create takes'); }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

routes.post('/api/chargeElectricVehicle', async (req, res) => {
  const user_id = req.body.userId;
  const vehicle_id = req.body.vehicle_id;
  const chargePercentage = req.body.percentage;
  try {
    const insertCharges = await db.query('INSERT INTO CHARGES SET ?', { c_user_id: user_id, vehicle_id: vehicle_id, percentage_charged_by: chargePercentage });
    if (!insertCharges.affectedRows) { throw new Error('Unable to insert into charges'); }

    const selectElectricVehicleCharging = await db.query('SELECT battery_percentage FROM ELECTRIC_VEHICLE WHERE vehicle_id=?', [vehicle_id]);
    if (!selectElectricVehicleCharging.length) { throw new Error('Unable to select electric vehicle to charge'); }
    const oldPercentage = selectElectricVehicleCharging[0].battery_percentage;
    console.log(oldPercentage);
    const percentage = helper.calcNewPercentage(chargePercentage, oldPercentage);
    console.log(percentage);
    const updateElectricVehiclePercent = await db.query('UPDATE ELECTRIC_VEHICLE SET battery_percentage=? WHERE vehicle_id=?', [percentage, vehicle_id]);
    if (!updateElectricVehiclePercent.affectedRows) { throw new Error('Unable to update electric vehicle percentage'); }

    const chargerPayRate = await db.query('SELECT charge_price_per_percent FROM CHARGER WHERE user_id=?', [user_id]);
    if (!chargerPayRate.length) { throw new Error('Unable to get charger pay rate'); }
    const getOldBalance = await db.query('SELECT balance FROM PAYMENT_ACCOUNT WHERE user_id=?', [user_id]);
    if (!getOldBalance.length) { throw new Error('Unable to get charger account balance'); }
    const payAmount = helper.calcPayAmount(chargerPayRate[0].charge_price_per_percent, chargePercentage);
    const newBalance = helper.calcNewBalance(payAmount, getOldBalance[0].balance);

    const payCharger = await db.query('UPDATE PAYMENT_ACCOUNT SET balance=? WHERE user_id=?', [newBalance, user_id]);
    if (!payCharger.affectedRows) { throw new Error('Unable to update electric vehicle percentage'); }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

routes.post('/api/addFunds', async (req, res) => {
  const user_id = req.body.userId;
  const amountAdded = req.body.amount;

  try {
    const getBalance = await db.query('SELECT balance FROM PAYMENT_ACCOUNT WHERE user_id=?', [user_id]);
    if (!getBalance.length) { throw new Error('Unable to select balance from payment account'); }
    const oldBalance = getBalance.balance;
    const balance = helper.calcNewBalance(amountAdded, oldBalance);

    const setNewBalance = await db.query('UPDATE PAYMENT_ACCOUNT SET balance=? WHERE user_id=?', [balance, user_id]);
    if (!setNewBalance.affectedRows) { throw new Error('Unable to update payment account'); }
    res.status(200).json({ success: true });
  } catch(error) {
    console.log(error);
    res.status(400).json({ success: false});
  }
});

routes.post('/api/withdrawFunds', async (req, res) => {
  const user_id = req.body.userId;
  try {
    const results = await db.query('UPDATE PAYMENT_ACCOUNT SET balance=0 WHERE user_id=?', [user_id]);
    if (!results.affectedRows) { throw new Error('failed to withdraw account balance'); }
    res.status(200).json({ success: true });
  } catch(error) {
    console.log(error);
    res.status(400).json({ success: false });
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
    const selectAvailableDriver = await db.query('SELECT user_id FROM DRIVER WHERE availability=true');
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
    const updateDriver = await db.query('UPDATE DRIVER SET availability=false WHERE user_id=?', [driverId]);
    if (!updateDriver.affectedRows) { throw new Error('Unable to update drivers status'); }
    //  create a new car trip
    const createCarTrip = await db.query('INSERT INTO CAR_TRIP SET ?', { trip_id: tripId, driver_id: driverId });
    if (!createCarTrip.affectedRows) { throw new Error('Unable to create car trip'); }
    //  create a "takes" entity
    const createTakes = await db.query('INSERT INTO TAKES SET ?', { Trip_id: tripId, user_id: userId, user_who_initiated_trip_id: userId });
    if (!createTakes.affectedRows) { throw new Error('Unable to create takes'); }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

routes.get('/api/getCustomerTripStatus', async (req, res) => {
  const userId = req.query.userId;
  try {
    const getCustomerTrip = await db.query('SELECT * FROM CUSTOMER AS C, TAKES AS TA, TRIP AS TR WHERE end_time IS NULL AND C.user_id=TA.user_id AND TA.Trip_id=TR.trip_id AND C.user_id=?', [userId]);
    if (!getCustomerTrip.length) { throw new Error('Unable to get customers trip status'); }
    res.status(200).json({ success: true, message: 'Trip loaded successfully.', tripId: getCustomerTrip.trip_id });
  } catch(error) {
    console.log(error);
    res.status(400).json({ success: false});
  }
});

routes.get('/api/getAvailableElectricVehicles', async (req, res) => {
  try {
    const scooters = await db.query('SELECT * FROM ELECTRIC_VEHICLE AS E, SCOOTER AS S WHERE E.vehicle_id=S.vehicle_id AND E.availability=true');
    const bikes = await db.query('SELECT * FROM ELECTRIC_VEHICLE AS E, BIKE AS B WHERE E.vehicle_id=B.vehicle_id AND E.availability=true');
    if (!scooters.length && bikes.length) throw new Error('No available vehicles in database.');
    res.status(200).json({ success: true, scooters, bikes });
  } catch (error) {
    console.log(error);
    res.status(400).json({ 'success': false });
  }
});

routes.get('/api/getCustomerTrip', async (req, res) => {
  const customerId = req.query.userId;
   try {
    //  probably need to join customer, trip, takes
    //  and do a SEPERATE query where you join customer, trip, takes, and car_trip
    //  in both of the above, make sure that end_time is NULL for trip (use IS NULL not = NULL)
    //  end_time being null means the customer hasn't ended it yet
    //  just return everything i guess lol
    const customersTrips = await db.query('SELECT * FROM CUSTOMER AS C, TRIP AS TR, TAKES AS TA WHERE C.user_id=TA.user_who_initiated_trip_id AND TR.Trip_id=TA.trip_id AND TR.end_time IS NULL AND C.user_id=?', 
    [customerId]);
    if(!customersTrips.length) { throw new Error('Unable to get customers current trip'); }
    const carTrip = await db.query('SELECT * FROM CAR_TRIP AS CT, TRIP AS T WHERE CT.trip_id=?' [customersTrips.trip_id]);
    if(!carTrip.length) {
      res.status(200).json({success: true, type: 'electricVehicleTrip', trip: customersTrips[0]});
    } else {
      res.status(200).json({success: true, type: 'carTrip', trip: customersTrips[0]});
    }
   } catch (error) {
     console.log(error);
     res.status(400).json({success: false});
   }
});

routes.post('/api/rateDriver', async (req, res) => {
  try {
    const driverId = req.body.driverId;
    //  this is a bit of a yikes, but you'll need to count how many car trips they've done
    //  so we can average the rating properly
    //  easier to test the SQL in phpmyadmin FIRST before using it here
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

routes.post('/api/rateCustomer', async (req, res) => {
  try {
    const customerId = req.body.customerId;
    //  basically a clone of before but CUSTOMER instead of DRIVER
    //  you'll need to count how many car trips they've done
    //  so we can average the rating properly
    //  easier to test the SQL in phpmyadmin FIRST before using it here
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

routes.post('/api/payForTrip', async (req, res) => {
  try {
    const fare = req.body.fare; //  should we pass in the fee, or pass in 
    const tripId = req.body.tripId; // the tripId and look up the fare instead?
    //  how about we talk about this amongst the three of us before you actually get to it

    //  maybe we should make it like you check if the trip is a car trip, if yes, we add cleanup_fee to the base fare

    //  btw I think you should ALWAYS add money to the driver
    //  but if the customer doesn't have enough, we suspend their account (and Ryde just pays the driver the remaining amount)
    //  (I can add a "suspended" attribute to the customer table and then prevent them on the front end from doing shit)
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

routes.post('/api/setCleanupFee', async (req, res) => {
  try {
    const cleanupFee = req.body.cleanupFee;
    const tripId = req.body.tripId;
    //  set cleanup fee in car_trip
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
});

routes.get('/api/getDriverTripStatus', async (req, res) => {
  // let me (oscar) do this one, i have a plan
});

routes.get('/api/getDriverTrip', async (req, res) => {
  //  used to populate driver manage trip page
});

module.exports = routes;