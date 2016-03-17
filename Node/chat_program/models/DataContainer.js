/**
Contains variables used throughout the code in order to allow for quick replacement
@author David Greenberg
@module DataContainer
@private
@property {string} userdb - contains the site of the user database
@property {string} websitedb - contains the site of the website database
*/

module.exports = {
  'userdb':'mongodb://localhost/passport_local_mongoose_express4',
  'websitedb':'mongodb://localhost/website_list'
}
