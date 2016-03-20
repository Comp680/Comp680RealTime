var express = require('express');
var router = express.Router();

var passport = require('passport');
var Account = require('../models/account');
var cors = require('../controller/cor_configuration.js');
/**
 * @api {get} /users Retrieve the main page of the site
 * @apiGroup Default
 * @apiName FrontPage
 */
router.get('/', function (req, res, next) {
    res.render('index', {
        user: req.user,
        title: "Login"
    });
});

/**
 * @api {post} /users/register Register a new user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} username The desired username of the user
 * @apiParam {String} password The desired password of the user
 *
 * @apiSuccess {String} username The username of the user
 * @apiSuccessExample {json} Success-Response: HTTP/1.1 200 OK { "username":
 *                    "John" }
 * @apiError AlreadyExists Username already exists
 * @apiErrorExample {json} Error-Response: 
 * HTTP/1.1 409 Conflict 
 * { "error": "AlreadyExists" }
 */
router.post('/register', cors, function (req, res, next) {
    
    Account.register(new Account({
        username: req.body.username
    }), req.body.password, function (err, account) {
        if (err) {
            return res.status(409).send({
                error: "AlreadyExists"
            });
        }
        
        passport.authenticate('user')(req, res, function () {
            res.status(200).send({
                "username": req.body.username
            });
        });

    });
});

/**
 * @api {get} /users/register Request registration page
 * @apiName CreateUserPage
 * @apiGroup User
 *
 */
router.get('/register', function (req, res) {
    res.render('register', {});
});

/**
 * @api {get} /users/login Request Login Page
 * @apiName RequestLogin
 * @apiGroup User
 *
 *
 */
router.get('/login', function (req, res) {
    res.render('login', {
        user: req.user
    });
});

/**
 * @api {post} /users/login Log a user in
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiParam {String} username The id of the user
 * @apiParam {String} password The password of the user
 *
 * @apiSuccess {String} username The username of the user
 * @apiSuccessExample {json} 
 * Success-Response: HTTP/1.1 200 OK 
 * { 
 *  "username":"John" 
 * }
 * @apiError {JSON} UserNotFound The <code> username </code> of the User was not
 *           found
 * @apiErrorExample {json} Error-Response: 
 * HTTP/1.1 404 Not Found 
 * { 
 * "error": "UserNotFound"
 *  }
 */
router.post('/login', cors, function (req, res, next) {
    
    passport.authenticate('user',
    function (err, user, info) {
        if (err) {
            return next(err);
        }
        
        if (!user) {
            // Send an error message. No such user
            return res.status(404).send({
                "error": "UserNotFound"
            });
        }
        
        //Check if user has account
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            
            // Send user information
            return res.status(200).send({
                "username": user.username
            });
        });

    })(req, res, next);
});

/**
 * @api {get} /users/logout Log a user out
 * @apiName LogoutUser
 * @apiGroup User
 */
router.get('/logout', function (req, res) {
    req.logout();
});

/**
 * @api {get} /users/ping Ping the server
 * @apiName Ping
 * @apiGroup Ping
 */
router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});

router.get('/login', function (req, res, next) {
    res.render('error', {
        title: 'Express'
    });
});



module.exports = router;
