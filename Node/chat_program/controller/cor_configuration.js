/*
Configuration for Cross-Origin-Request-Service
*/

var cors = require('cors');
var Account = require('../models/webaccount');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var database = require('../models/DataContainer');

passport.use('website',new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
//Mangoose Connection
//mongoose.createConnection(database.websitedb);


/*
Allows for cors connections
*/
var corsOptions = {
  origin: function(origin, callback) {
    var originIsWhitelisted = true;
    console.log(origin);
    callback(null, originIsWhitelisted);
  }
};

module.exports = cors(corsOptions);
