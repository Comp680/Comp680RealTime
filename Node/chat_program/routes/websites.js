var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var passport = require('passport');
var Account = require('../models/webaccount');


/**
 * @api {get} /users/register Request registration page
 * @apiName RegisterWebsitePage
 * @apiGroup WebsiteManagement
 *
 */
router.get('/register', function(req, res) {
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
router.post('/register', function(req, res,next) {

  Account.register(new Account({
    'website': req.body.website,
    'game_code': uuid.v1(),
    'username': req.body.username
  }),req.body.password, function(err, account) {
    if (err) {
      return res.status(409).send({
        error: "AlreadyExists",
        reason: err
      });
    }

    //Attempt to login
    passport.authenticate('website')(req, res, function() {
      res.status(200).send({
        "username": req.body.username,
        "website": req.body.website
      });
    });

  });
});

module.exports = router;
