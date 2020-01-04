const get = (req, res, db) => {
  db.select(db.ref('fixtures.id').as('fixtureId'), 'fixtures.description')
    .count('submissions.id')
    .from('fixtures')
    .leftOuterJoin('submissions', 'fixtures.id', 'submissions.fixture_id')
    .groupBy('fixtures.id')
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.error(err);
      res.status(400).send("Invalid status query");
    });
}

module.exports = {
  get: get
}
