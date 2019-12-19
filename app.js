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
app.post('/submission', (req, res) => {
	console.log(req.body);
	const {fixtureId, userId, stocks} = req.body;

	db.insert({fixture_id: fixtureId, employee_id: userId, datetime: new Date().toISOString()})
    .into('submissions')
    .returning('id')
    .then(ids => insertStocktakes(stocks, ids[0], db, res))
    .catch(err => {
      console.error(err);
      res.status(400).send("Fixture ID/user ID does not exist");
    });
});

// Test API (GET) 
app.get('/test', (req, res) => {
  res.send("Connection successful!");
});

const insertStocktakes = (stocks, submissionId, db, res) => {
	let stockRows = [];
	stocks.forEach(element => {
		stockRows.push({id: stockRows.length + 1, submission_id: submissionId, upc: element.upc, count: element.count});
	});
	db.insert(stockRows)
    .into('stocktakes')
    .then(() => res.status(200).send('Successful'))
    .catch(err => {
      console.error(err);
      res.status(400).send("Invalid json format");
    });
};


app.listen(port, () => console.log(`Inventory-control api listening on port ${port}!`));
