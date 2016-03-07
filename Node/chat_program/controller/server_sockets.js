/**
 * New node file
 */

var number_in_room = 0;
var room_number = 0;
var room_min_size = 2;
var room_max_size = 2;
var room_object = require("./socket_rooms");
var wait_rooms = new room_object(room_min_size, room_max_size);

module.exports = function(io) {
	/**
	 * Emit a message to multiple users
	 * @param {string} socket_id - The id of the client socket to whom the message will be sent
	 * @param {JSON|string} msg - The message to send to the client
	 * @param {string} emit_to - The location to emit the message to
	 */
	function emit_new_message(socket, msg, emit_to) {
		var rooms = socket.adapter.rooms;
		rooms = wait_rooms.find_room_by_socket_id(socket, socket.id, rooms);
		if (typeof msg['for'] != "undefined"
				&& msg['for'].toLowerCase() === 'not_me') {
			while (rooms.length > 0) {
				socket.broadcast.to(rooms.pop()).emit(emit_to, {
					'msg' : msg.msg,
				});
			}
		} else {
			while (rooms.length > 0) {
				io.to(rooms.pop()).emit(emit_to, {
					'msg' : msg.msg,
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
			'msg' : msg.msg
		});
	}

	io.sockets.on('connection', function(socket) {
		socket.emit('connection_status', {
			msg : "Connection Successful"
		});// Send
		// information
		// about
		// successful
		// connection

		socket.on('disconnect', function() {

		});

		// Overwrite the default socket connection for on-close
		// Allows operations to be performed before the object is deleted
		socket.onclose = function(reason) {
			// emit to rooms here
			emit_new_message(socket, {
				msg : "user disconnect"
			}, "user_disconnected");
			Object.getPrototypeOf(this).onclose.call(this, reason);
		}

		// User wants to join a game
		socket.on('join_game', function(msg) {
			var room_info = wait_rooms.add_to_room(socket, msg.game_id);
			var room_num = room_info.room;

			io.to(socket.id).emit('you_join', {// Send message to user
				// based on their room
				'msg' : msg.msg,
				'player_number' : room_info.user_number
			});

			//Emit message to other users of a new client joining
			emit_new_message(socket, {
				'msg' : msg.msg,
				'for' : 'not_me'
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
		 * @access private
		 */
		function start_game(socket, room) {
			var rooms = socket.adapter.rooms;
			var count = 1;
			Object.keys(rooms[room.id].sockets).forEach(function(element, index, array) {
				single_emit_new_message(element, {
					'msg' : {
						'msg': 'Game Start',
						'player': count
					}
				}, "game_start");
				count++;
			});

		}

		socket.on('user_disconnecting', function(msg) {
			emit_new_message(socket, msg, "user_disconnected");
			socket.disconnect();
		});

		socket.on('game_message', function(msg) {// Emit a game message
			emit_new_message(socket, msg, 'game_update');
		});

	});
};