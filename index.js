const Sequelize = require('sequelize');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dbconfig = require('./dbconfig');
const bootstrapModels = require('./models');

// After Sign up (create user), create and return token in same request

// Connect with DB and check connection
const sequelize = new Sequelize(dbconfig);

sequelize
  .authenticate()
  .then(
    _ => console.log('Connection established successfully.'),
    err => console.error('Unable to connect to the database:', err)
  );

// Dev only. Remove for Production
//sequelize.sync({ force: true });

// Testing

// Initialize Models
bootstrapModels(sequelize);

// Start app
const routes = require('./routes');
const PORT = parseInt(process.env.PORT, 10) || 8000;
const app = express();

// Allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.send(200);
  }

  next();
});

// Initial middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle Requests
app.use('/api', routes);

app.listen(PORT);
console.log(`Server listening at ${PORT}`);
