/**
Contains variables used throughout the code in order to allow for quick replacement
@author David Greenberg
@module DataContainer
@private
@property {string} userdb - contains the site of the user database
@property {string} websitedb - contains the site of the website database
*/

module.exports = {
  'userdb':'mongodb://localhost/user_list',
  'websitedb':'mongodb://localhost/website_list',
  'host':'http://localhost:3000'
}
