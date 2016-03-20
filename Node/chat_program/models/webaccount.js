/*
 * @author: David Greenberg
 * Mongoose Model WebsiteAccount
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var gameAccount = require('./games');
//Account schema for a website information
var Account = new Schema({
    website: String,
    game_code: [gameAccount],
    username: String,
    password: String
});

Account.plugin(passportLocalMongoose);



module.exports = mongoose.model('WebsiteAccount', Account);
