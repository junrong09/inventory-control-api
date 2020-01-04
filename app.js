const env = require('dotenv').config();
if (env.error) {
  console.log("Environment file (i.e. .env) not found/contains error.");
  throw env.error;
}

const express = require('express');
const cors = require('cors');
const app = express();
const knex = require('knex');
const port = 3001;

const submission = require('./controllers/submission.js');
const status = require('./controllers/status.js');
const fixture = require('./controllers/fixture.js');

const db = knex({
  client: 'pg',
  connection: {
    host : process.env.RDS_HOSTNAME,
    user : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    database : 'inventory-control'
  }
});

app.use(cors());
app.use(express.json());

// Submission API (POST)
app.post('/submission', (req, res) => submission.post(req, res, db));
app.get('/status', (req, res) => status.get(req, res, db));

// Test API (GET) 
app.get('/test', (req, res) => {
  res.send("Connection successful!");
});



app.listen(port, () => console.log(`Inventory-control api listening on port ${port}!`));
