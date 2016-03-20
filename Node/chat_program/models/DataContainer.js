/**
Contains variables used throughout the code in order to allow for quick replacement
@author David Greenberg
@module DataContainer
 * @private

*/

/**
 * Contains information about the current website for ease of changing information
 * @typedef WebsiteProperties
 * @type {object}
 * @property {string} userdb - contains the site of the user database
 * @property {string} websitedb - contains the site of the website database
 * @property {string} host - The ip of the current site
 * @property {string} sessionStoragedb - The url for the mongodatabase for storing sessions
 * @property {string} socketRoomsdb - The url for the mondgodabase for storing room information
 * @private
 * */
module.exports = {
    'userdb': 'mongodb://localhost/user_list',
    'websitedb': 'mongodb://localhost/website_list',
    'sessionStoragedb': "mongodb://localhost/sessionsDB",
    'socketRoomsdb': "mongodb://localhost/roomsDB",
    'host': 'http://localhost:3000'
   
}
