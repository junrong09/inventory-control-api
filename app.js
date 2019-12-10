const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
const knex = require('knex');
const port = 3001;

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'junrong',
    password : '',
    database : 'inventory-control'
  }
});

//app.use(bodyParser.json());
app.use(express.json());

app.post('/submission', (req, res) => {
	console.log(req.body);
	const {fixtureId, userId, stocks} = req.body;

	//db.select('*').from('fixtures').then(data => console.log(data));
	db.insert({fixture_id: fixtureId, employee_id: userId, datetime: new Date().toISOString()}).into('submissions').returning('id').then(id => insertStocktakes(stocks, id[0], db));
	res.send('Successful!');
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
