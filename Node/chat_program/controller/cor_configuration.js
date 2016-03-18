/*
Configuration for Cross-Origin-Request-Service
*/

var cors = require('cors');
var Account = require('../models/webaccount');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var database = require('../models/DataContainer');
passport.use('website',Account.createStrategy())
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
//Mangoose Connection
mongoose.createConnection(database.websitedb);

Account.find({website:database.host},function(err,docs){
  if(docs.length == 0){
    (new Account({website:database.host})).save(function (err) {
      if (err) return console.error(err);
    });
  }


})
//Create a new account for the local site


/*
Allows for cors connections
*/
var corsOptions = {
  'origin': function(origin, callback) {
    Account.find({website:new RegExp("^" + origin + "*","i")},function(err,docs){
      var originIsWhitelisted = docs.length > 0;
      callback(null, originIsWhitelisted);
    });

  },
  'credentials':true
};

module.exports = cors(corsOptions);
