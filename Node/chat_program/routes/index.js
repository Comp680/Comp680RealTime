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
 *@apiSuccess {String} username The username of the user
 * @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 OK
*     {
*       "username": "John"
*     }
 * @apiError AlreadyExists Username already exists
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 409 Conflict
 *     {
 *       "error": "AlreadyExists"
 *     }
 */
router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }),
    req.body.password,
    function(err, account) {
        if (err) {
              return res.status(409).send(
              {
                error: "AlreadyExists"
              }
          );
        }

        passport.authenticate('local')(req, res, function () {
            res.status(200).send({
              "username":req.body.username
            });
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
 *
 * @apiSuccess {String} username The username of the user
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "username": "John"
 *     }
 * @apiError {JSON} UserNotFound The <code> username </code> of the User was not found
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
router.post('/login', passport.authenticate('local',

 function(err, user, info) {
   if(err){
     //Send an error message. No such user
     res.status(404).send({
       "error":"UserNotFound"
     });
   }else{
     //Send user information
     res.status(200).send({
       "username":user
     })
   }
 }


));

/**
 * @api {get} /logout Log a user out
 * @apiName LogoutUser
 * @apiGroup User
 */
router.get('/logout', function(req, res) {
    req.logout();
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
