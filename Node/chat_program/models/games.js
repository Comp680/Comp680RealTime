/*
 * @author: David Greenberg
 * Mongoose Model GameData
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

//Account schema for a website information
var Account = new Schema({
    name: String,
    game_id: String
});

//Account.plugin(passportLocalMongoose);



module.exports = Account
