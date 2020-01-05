const post = (req, res, db) => {
  let list = req.body;
  let pass = [];
  let failed = [];
  Promise.all(list.map(fixture => insert(fixture, res, db, pass, failed)))
    .then(() => {
      res.status(200).json({failed: failed, inserted: pass});
    })
    .catch(err => res.status(400).send('Failed to add fixture(s)'));
};

const insert = (fixture, res, db, pass, failed) => {
  return db.insert({id: fixture.fixtureId, description: fixture.description})
    .into('fixtures')
    .then(() => {
      pass.push(fixture.fixtureId);
    })
    .catch(err => {
      failed.push(fixture.fixtureId);
    });
}

module.exports = {
  post: post
}
