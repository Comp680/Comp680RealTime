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


module.exports = passport;
