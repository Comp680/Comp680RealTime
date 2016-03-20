var Account = require('../models/webaccount');
/**
 * @module website_registration
 * @author David Greenberg
 * */


/**
 * A callback designed to be 
 *
 * @callback isRegistered
 * @param {Object} req
 */

/**
 * Assynchronously check if a website has been registered 
 * @param {Object} req - The request sent by the user
 * @param {isRegistered} callback - Callback which handles the response
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
 * A module which contains functions to check for website registration
 * */
module.exports = {
    isRegistered: isWebsiteRegistered
}