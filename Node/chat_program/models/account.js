/*
 * @author: David Greenberg
 * Mongoose Model Account
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    name: String,
    role: {type: Number, default:1}
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);