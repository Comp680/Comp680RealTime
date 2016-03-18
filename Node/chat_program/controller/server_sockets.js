var number_in_room = 0;
var room_number = 0;
var room_min_size = 2;
var room_max_size = 2;
var room_object = require("./socket_rooms");
var authorized = require("./users");
var wait_rooms = new room_object(room_min_size, room_max_size);
/**
 * Server Object
 * @external "http.Server"
 * @see {@link https://nodejs.org/api/http.html#http_class_http_server}
 **/



/**
 * Emit a message to multiple users
 * @param {external:http.Server} io - Socket.io object
 * @class
 */
function create_socket(io) {


  //Set up a handshake to check if the user is authorized
  io.use(function(socket, next) {
    var handshake = socket.request;
    next();

  });

  io.set('authorization', function(handshake, callback) {
    var auth = false;
    if (authorized.isAuthorized(handshake)) {
      auth = true;
    }
    callback(null, auth);
  });

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
        socket.broadcast.to(rooms.pop()).emit(emit_to, {
          'msg': msg.msg,
        });
      }
    } else {
      while (rooms.length > 0) {
        io.to(rooms.pop()).emit(emit_to, {
          'msg': msg.msg,
        });
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
    io.to(socket_id).emit(emit_to, {
      'msg': msg.msg
    });
  }

  /**
   * On Connection Event - Create the socket for the request
   * @type {object}
   * @private
   * @event io.sockets#connection
   */
  io.sockets.on('connection', function(socket) {

    socket.emit('connection_status', {
      msg: "Connection Successful"
    }); // Send
    // information
    // about
    // successful
    // connection


    socket.on('disconnect', function() {

    });


    /**
     * Override the default socket connection for on-close.
     * Allows operations to be performed before the object is deleted
     * @private
     * @event create_socket#disconnect
     */
    socket.onclose = function(reason) {
      // emit to rooms here
      emit_new_message(socket, {
        msg: "user disconnect"
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
    socket.on('join_game', function(msg) {
      var room_info = wait_rooms.add_to_room(socket, msg.game_id);
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
      io.to(socket.id).emit('you_join', { // Send message to user
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
        'for': 'not_me'
      }, "user_join");

      if (room_info.full) {
        start_game(socket, room_num);
      }

    });

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
      Object.keys(rooms[room.id].sockets).forEach(function(element, index, array) {
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
    socket.on('user_disconnecting', function(msg) {
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
    socket.on('game_message', function(msg) { // Emit a game message
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
