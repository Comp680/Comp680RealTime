var redis = require("redis");

/**
 * Create an object containing a redis connection
 * @class
 * @constructor
 * @private
 * @param {string} host - the host number
 * @param {Number} port - the port number
 * 
 * */
var RoomConnections = function (host, port) {
    this._client = redis.createClient(port, host);
    
    this.closeConnection = function () {
        this._client.quit();
    }
    
    /**
     * Find a room which has an opening for a new player
     * @param {string} gameID - The ID of the game to which a room needs to be found
         **/
    this.findOpenRoom = function (gameID) {
        this._client.hgetall(gameID, function (err, obj) {
            for (room in obj) {

            }


        });
    }
    
    /**
     * Create a new room in the database with a provided room ID
     * Room will contain one value "Number_In_Room" with value 0
     * @function
     * @param {string} gameID - The ID number to which the game the room should be created in is set
     * @param {string} roomID - The ID number to which the room should be set
     */
    this.addRoom = function (gameID, roomID) {
        this._client.hmset(gameID, roomID, 0);
    }
    
    /**
     * Add a new user to the database
     * @function
     * @param {string} gameID - The ID number to which the game the room should be created in is set 
     * @param {string} roomID - The id which the room is represented by
     * @param {string} userID - The id which the user is represented by
     * @param {string} socketID - The id of the socket which the user is using
     */
     this.addUserToRoom = function (gameID, roomID, userID, socketID) {
        var _client = this._client;
        this._client.hmset(roomID, socketID, userID);
        
        this._client.hget(gameID, roomID, 
            function (err, replies) {
            if (err) {

            } else {
                _client.hset(gameID, roomID, parseInt(replies[0]) + 1);
                console.log("room_reply: " + replies[0]);
            }
        });
    }
    
    
    
    
    return this;
}

module.exports = {
    
    "RoomConnections": RoomConnections

};