const express = require('express');
const path = require('path')
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();

app.use(cors(), bodyParser());

//  Connect all our routes to our application
app.use('/', routes);

app.listen(5000)
console.log('Server running on port 5000')