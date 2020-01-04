const post = (req, res, db) => {
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

}

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


module.exports = {
  post: post
}
