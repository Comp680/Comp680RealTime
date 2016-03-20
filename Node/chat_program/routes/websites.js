var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var passport = require('passport');
var Account = require('../models/webaccount');
var webreg = require('../controller/website_registration');

/**
 * @api {get} /websites/register Request registration page
 * @apiName RegisterWebsitePage
 * @apiGroup WebsiteManagement
 *
 */
router.get('/register', function (req, res) {
    res.render('website/register', {});
});



/**
 * @api {post} /websites/register
 * @apiName RegisterWebsite
 * @apiGroup WebsiteManagement
 *
 * @apiParam {String} website The website desired to be added
   @apiParam {String} username The desired username
 * @apiParam {String} password The desired password of the user
 *
 *
 * @apiSuccess {String} acceessCode The code required by the website
 * @apiSuccess {String} website The website name you provided
 * @apiSuccessExample {json} Success-Response:
  HTTP/1.1 200 OK
  { "username":"John",
    "website":"site"
  }
 * @apiError AlreadyExists Website already exists
 * @apiErrorExample {json} Error-Response:
  HTTP/1.1 409 Conflict
    {
      "error":"AlreadyExists",
      "reason":
    }
 */
router.post('/register', function (req, res, next) {
    
    Account.register(new Account({
        'username': req.body.username,
        'website': req.body.website,
        'game_code': [{}]
    
    }), req.body.password, function (err, account) {
        if (err) {
            return res.status(409).send({
                error: "AlreadyExists",
                reason: err
            });
        }
        
        //Attempt to login
        passport.authenticate('website')(req, res, function () {
            res.status(200).send({
                "username": req.body.username,
                "website": req.body.website
            });
        });

    });
});

/**
 * @api {get}  /websites/login Request the website login page
 * @apiName LoginWebsiteManager
 *  @apiGroup WebsiteManagement
 */
router.get('/login', function (req, res) {
    res.render('website/login', {});
});

router.post('/login', function (req, res, next) {
    
    passport.authenticate('website',
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
            res.redirect("settings");
        });

    })(req, res, next);
});

/**
 * @api {get} /website/setting View the users setting screen
 * @apiName WebsiteSettings
 * @apiGroup WebsiteManagement
 * */
router.get('/settings', webreg.isLoggedIn, function (req, res, next) {
    
    var game_list = Account.findOne({ 'username': req.user.username }, function (err, user) {
        res.render('website/settings', {
            username: req.user.username,
            games: user.game_code
        });
    }); 

    
});



module.exports = router;
