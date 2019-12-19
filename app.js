const express = require('express');
const cors = require('cors');
const app = express();
//const bodyParser = require('body-parser');
const knex = require('knex');
const port = 3001;

const db = knex({
  client: 'pg',
  connection: {
    host : process.env.RDS_HOSTNAME,
    user : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database : 'inventory-control'
  }
});

//app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.post('/submission', (req, res) => {
	console.log(req.body);
	const {fixtureId, userId, stocks} = req.body;

	db.insert({fixture_id: fixtureId, employee_id: userId, datetime: new Date().toISOString()}).into('submissions').returning('id').then(ids => insertStocktakes(stocks, ids[0], db));
	res.send('Successful!');
});

app.get('/test', (req, res) => {
  res.send("Connection successful!");
});

const insertStocktakes = (stocks, submissionId, db) => {
	let stockRows = [];
	stocks.forEach(element => {
		stockRows.push({id: stockRows.length + 1, submission_id: submissionId, csku_id: element.cskuId, count: element.count});
	});
	console.log(stockRows);
	db.insert(stockRows).into('stocktakes').then(console.log);
};


app.listen(port, () => console.log(`Inventory-control api listening on port ${port}!`));
