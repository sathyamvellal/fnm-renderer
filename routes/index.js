var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/njk', function(req, res, next) {
  res.render('index.njk', { title: 'Express' });
});

router.get('/md', function(req, res, next) {
  res.render('index.md', { title: 'Express' });
});

module.exports = router;
