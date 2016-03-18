/**
Contains variables used throughout the code in order to allow for quick replacement
@author David Greenberg
@module DataContainer
@private
@property {string} userdb - contains the site of the user database
@property {string} websitedb - contains the site of the website database
 * @propterty {string} host - The ip of the current site
 * @propterty {string} sessionStoragedb - The url for the mongodatabase
*/

module.exports = {
  'userdb':'mongodb://localhost/user_list',
    'websitedb': 'mongodb://localhost/website_list',
    'sessionStoragedb':"mongodb://localhost/sessionsDB",
    'host': 'http://localhost:3000',
   
}
