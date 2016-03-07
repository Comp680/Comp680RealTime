var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('tic-tac-toe', { title: 'Tic Tac Toe' });
});

router.get('/chess', function(req, res, next) {
	  res.render('chess', { title: 'Chess-Game' });
	});

module.exports = router;
