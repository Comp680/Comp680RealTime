/*
 * @author: David Greenberg
 * Mongoose Model WebsiteAccount
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    website: String,
    accessCode: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('WebsiteAccount', Account);
