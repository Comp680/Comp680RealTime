var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');

/**
 * @api {get} / Retrieve the main page of the site
 * @apiGroup Default
 * @apiName FrontPage
 */
router.get('/', function(req, res, next) {
  res.render('index', { user : req.user, title: "Login" });
  console.log('test');
});

/**
 * @api {post} /register Request User information
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} username The desired username of the user
 * @apiParam {String} password The desired password of the user
 * 
 */
router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

/**
 * @api {get} /register Request registration page
 * @apiName CreateUserPage
 * @apiGroup User
 *
 */
router.get('/register', function(req, res) {
    res.render('register', { });
});

/**
 * @api {get} /login Request Login Page
 * @apiName RequestLogin
 * @apiGroup User
 * 
 
 */
router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

/**
 * @api {post} /login Log a user in
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {String} username The id of the user
 * @apiParam {String} password The password of the user
 */
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

/**
 * @api {get} /logout Log a user out
 * @apiName LogoutUser
 * @apiGroup User
 */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/**
 * @api {get} /ping Ping the server
 * @apiName Ping
 * @apiGroup Ping
 */
router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

router.get('/login',function(req,res,next){
	  res.render('error', { title: 'Express' });
});



module.exports = router;
