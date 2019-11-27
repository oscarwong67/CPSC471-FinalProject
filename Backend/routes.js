const routes = require('express').Router();
const db = require('./db');

routes.get('/api/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.post('/api/login', (req, res) => {
  db.query('SELECT * FROM USER WHERE Email=? AND Password=?', [req.query.email, req.query.password], (error, results) => {
    //  need find out what's wrong with result
    if (error) {
      console.log(error.message);
      res.status(400).json({ message: 'Failure!' });  //  example of error case for HTTP 400 (bad request)
    } else {
      res.status(200).json({
        'success': true,
        'accountId': results[0].User_id
      });
    }
  });
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