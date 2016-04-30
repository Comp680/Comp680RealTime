var number_in_room = 0;
var room_number = 0;
var room_min_size = 2;
var room_max_size = 2;
var room_object = require("./socket_rooms");
var authorized = require("./users");
var session = require('express-session'),
    DataContainer = require('../models/DataContainer'),
    MongoStore = require('connect-mongo')(session);
passportSocketIo = require("passport.socketio"),
cors = require("./cor_configuration");
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var webreg = require('./website_registration');
var wait_rooms = new room_object(room_min_size, room_max_size);

/**
 * @module server_sockets
 * */

/**
 * Server Object
 * @external "http.Server"
 * @see {@link https://nodejs.org/api/http.html#http_class_http_server}
 **/



/**
 * Emit a message to multiple users
 * @param {external:http.Server} io - Socket.io object
 * @function
 */
function create_socket(io) {
    
    //Check if the current connection attempt is from a registered site
    io.use(function (socket, accept) {
        webreg.isRegistered(socket.request, accept);
    });
    
    //Check if the current user is signed in
    io.use(passportSocketIo.authorize({
        passport: require('./users'),
        cookieParser: cookieParser,       // the same middleware you registrer in express 
        key: 'express.sid',       // the name of the cookie where express/connect stores its session_id 
        secret: 'worldwar1',    // the session_secret to parse the cookie 
        store: new MongoStore({
            "url": DataContainer.sessionStoragedb
        }),        // we NEED to use a sessionstore. no memorystore please 
        success: onAuthorizeSuccess,  // *optional* callback on success - read more below 
        fail: onAuthorizeFail,     // *optional* callback on fail/error - read more below 
    }));
    
    
    /**
     * The authorization of the socket was successful, user was logged in
         * @param {Object} data - The data passed from the successful connection 
     * @param {Boolean} accept - Is the authorization successful
     * @private
      */
    function onAuthorizeSuccess(data, accept) {
        console.log('successful connection to socket.io by ' + data.user.username);
        var temp = data.user.username;
        // The accept-callback still allows us to decide whether to 
        // accept the connection or not. 
        // If you use socket.io@1.X the callback looks different 
        accept();
    };
    
    /**
     * The authorization of the socket was unsuccessful
     * @param {Object} data - The data passed from the previus 
     * @param {String} message - The message recieved on failure
     * @param {Object} error - The error message
     * @param {callback} accept - The function called on to allow connection
     * @private
      */
    function onAuthorizeFail(data, message, error, accept) {
        if (error)
            throw new Error(message);
        console.log('failed connection to socket.io:', message);
        
        // We use this callback to log all of our failed connections. 
        // If you use socket.io@1.X the callback looks different 
        // If you don't want to accept the connection 
        if (error)
            accept(new Error(message));
  // this error will be sent to the user as a special error-package 
  // see: http://socket.io/docs/client-api/#socket > error-object 
    };
    
    
    /**
   * Emit a message to multiple users with a specified send format
   * @param {string} socket_id - The id of the client socket to whom the message will be sent
   * @param {JSON|string} msg - The message to send to the client
   * @param {string} emit_to - The location to emit the message to
   * @example <caption>Example of creating a new message</caption>
   * emit_new_message(socket,{"msg":msg, for:"not_me"},"test");
   *
   * @access private
   */
  function emit_new_message(socket, msg, emit_to) {
        var rooms = socket.adapter.rooms;
        rooms = wait_rooms.find_room_by_socket_id(socket, socket.id, rooms);
        if (typeof msg['for'] != "undefined" && msg['for'].toLowerCase() === 'not_me') {
            while (rooms.length > 0) {
                socket.broadcast.to(rooms.pop()).emit(emit_to, buildJsonMessageObject(msg));
            }
        } else {
            while (rooms.length > 0) {
                io.to(rooms.pop()).emit(emit_to, buildJsonMessageObject(msg));
            }
        }
    }
    /**
   * Emit a message to a single user
   * @param {string} socket_id - The id of the client socket to whom the message will be sent
   * @param {JSON|string} msg - The message to send to the client
   * @param {string} emit_to - The location to emit the message to
   */
  function single_emit_new_message(socket_id, msg, emit_to) {
        io.to(socket_id).emit(emit_to, buildJsonMessageObject(msg));
    }
    
    /**
     * Modify the message to be sent such that it is in the correct form 
     * @param {Object} msg - The object to be sent
     * @return {Object} 
     * @property {Any} msg - message sent by user
     * @property {Object} server - information sent by server
      */
    function buildJsonMessageObject(msg) {
        if (typeof msg.server == 'undefined')
            msg.server = {};
        
        return {
            'msg': msg.msg,
            'server': msg.server
        };
    }
    
    /**
   * On Connection Event - Create the socket for the request
   * @type {object}
   * @private
   * @event io.sockets#connection
   */
  io.sockets.on('connection', function (socket) {
        
        socket.emit('connection_status', {
            msg: "Connection Successful"
        }); // Send
        // information
        // about
        // successful
        // connection
        
        
        socket.on('disconnect', function () {

        });
        
        
        /**
     * Override the default socket connection for on-close.
     * Allows operations to be performed before the object is deleted
     * @private
     * @event create_socket#disconnect
     */
    socket.onclose = function (reason) {
            // emit to rooms here
            emit_new_message(socket, {
                msg: "user disconnect",
                server: {
                    username: socket.request.user.username
                }
            }, "user_disconnected");
            Object.getPrototypeOf(this).onclose.call(this, reason);
        }
        
        // User wants to join a game
        /**
     * Client has requested to join a game
     * @event create_socket#join_game
     * @fires io#you_join
     * @fires create_socket#user_join
     * @access private
     */
    socket.on('join_game', function (msg) {
            wait_rooms.add_to_room(socket, msg.game_id,msg,FinishJoinGame);
        });
        
        /**
         * Callback function for finising joining a game 
         * @param {object} msg - The message to return to the user
         * @param {object} room_info - The information about the current room
         **/
        function FinishJoinGame(msg,room_info) {
            var room_num = room_info.room;
            /**
       * Sends a message to the client that they have successfully joined a game
       * Includes the number player they are in the room
       * @event create_socket#you_join
       * @type {object}
       * @property {*} msg - Message sent by the user
       * @property {number} player - the number of the player
       * @private
       */
      io.to(socket.id).emit('you_join', {
                // Send message to user
                // based on their room
                'msg': msg.msg,
                'player': room_info.user_number
            });
            
            //Emit message to other users of a new client joining
            /**
       * Sends a message to all others users in a room that a new user has joined
       * @event create_socket#user_join
       * @private
       */
      emit_new_message(socket, {
                'msg': msg.msg,
                'server': {
                    'username': socket.request.user.username //return the name of the user
                },
                'for': 'not_me'
            }, "user_join");
            
            if (room_info.full) {
                start_game(socket, room_num);
            }

        }
        
        /**
     * The game should be started. Send notification of start to users.
     *
     * @param {socket}
     *            socket - The current client socket
     * @param {room_information_container}
     *            room - The room object containing information about the
     *            room
     * @fires create_socket#game_start
     * @access private
     */
    function start_game(socket, room) {
            var rooms = socket.adapter.rooms;
            var count = 1;
            Object.keys(rooms[room.id].sockets).forEach(function (element, index, array) {
                /**
         * Sends messages to users that a game has started
         * @event socket#game_start
         * @type {object}
         * @property {*} msg - A message the user has set as default
         * @property {number} player - The player's number in the game
         * @private
         */
        single_emit_new_message(element, {
                    'msg': {
                        'msg': 'Game Start',
                        'player': count
                    }
                }, "game_start");
                count++;
            });

        }
        
        /**
     * Disconnects a user from the socket
     * @fires create_socket#user_disconnected
     * @event create_socket#user_diconnecting
     * @access private
     */
    socket.on('user_disconnecting', function (msg) {
            /**
       * Sends message to all users who are still connected that another user has disconnected
       * @event create_socket#user_disconnected
       * @private
       */
      emit_new_message(socket, msg, "user_disconnected");
            socket.disconnect();
        });
        
        /**
     * Pass a message to whoever is meant to recieve it
     * @fires create_socket#game_update
     * @event create_socket#user_message
     * @access private
     */
    socket.on('game_message', function (msg) { // Emit a game message
            /**
       * Send information from one client to all other connected clients
       * @event create_socket#game_update
       * @private
       */
      emit_new_message(socket, msg, 'game_update');
        });

    });
};

module.exports = create_socket;
