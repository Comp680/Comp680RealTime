var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var database = require('../models/DataContainer');
//Password Config
var Account = require('../models/account');
//passport.use('user',new LocalStrategy(Account.authenticate()));
passport.use('user',Account.createStrategy())
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//Mangoose Connection
mongoose.connect(database.userdb);


/**
Checks if a users session is authorized
@param {object} req - The requesting object containing information about the cookie
*/
function session_authorized(req){
  if(typeof req!=='undefined' && typeof req.user !=='undefined' && req.user.username){
    return req.user.username;
  }else{
    return false;
  }
};

module.exports = {
  "passport":passport,
  "LocalStrategy":LocalStrategy,
  "isAuthorized":session_authorized
}
