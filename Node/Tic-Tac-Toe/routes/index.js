var express = require('express');
var router = express.Router();


router.get("/",function(req,res,next){
res.render("login");
});

router.get("/register",function(req,res,next){
  res.render("register");
});

/* GET home page. */
router.get('/tictactoe', function(req, res, next) {
  res.render('tic-tac-toe', { title: 'Tic Tac Toe' });
});

router.get('/chess', function(req, res, next) {
	  res.render('chess', { title: 'Chess-Game' });
	});

  router

module.exports = router;
