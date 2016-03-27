var Account = require('../models/webaccount');
var passport = require('./users');
/**
 * @module website_registration
 * @author David Greenberg
 * */


/**
 * A callback designed to be 
 *
 * @callback registeredNext
 * @param {Object} req
 */

/**
 * Assynchronously check if a website has been registered 
 * @function isWebsiteRegistered
 * @param {Object} req - The request sent by the user
 * @param {registeredNext} callback - Callback which handles the response
 * */
function isWebsiteRegistered(req,callback) {
    Account.find({ website: new RegExp("^" + req.headers.origin + "*", "i") }, function (err, docs) {
        var originIsWhitelisted = docs.length > 0;
        if (originIsWhitelisted) {
            callback();
        } else {
            callback('failed connection to socket.io: Website Not Registered');
        }
        
    });
}
/**
 * Middleware to register a new website linked to a user
 * @param {Object} req
 * @param (Object) res
 * @param (function) next
 * */
function registerNewWebsite(req, res, next) {
    
    if (req.body.website && req['user']) {
        console.log(req['user']._id);
        (new Account({ name: req.body.website, user_id: req['user']._id })).save(function (err) {
            if (err) return next(err);
        });
    } else {
        return next(err);
    }
}

/**
 * Route Middleware to check if user is logged in
 * @function isWebsiteRegistered
 * @param {Object} req - The request sent by the user
 * @param {Object} res - the reponse to send back
 * @param {registeredNext} next() - Callback which handles the response
 * */
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    
    // if they aren't redirect them to the home page
    res.redirect('/website/login');
}

/**
 * A module which contains functions to check for website registration
 * @property {isWebsiteRegistered} isRegistered
 * @property {isLoggedIn} isLoggedIn
 * */
module.exports = {
    isRegistered: isWebsiteRegistered,
    isLoggedIn: isLoggedIn,
    registerNewWebsite:registerNewWebsite
}