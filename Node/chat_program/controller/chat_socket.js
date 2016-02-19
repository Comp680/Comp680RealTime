/**
 * Contains functions for the socket
 */

// Object for containing information about the rooms
function waiting_rooms(min_room_size, max_room_size) {
	this.room_waiting = [0];
	this.number_in_room = 0;
	this.add_to_room = function(user_socker) {
		if(this.number_in_room >= max_room_size){
			this.room_waiting[0]++;
		}
		
		return this.room_waiting[0];
		
	}

	this.find_room_by_socket_id = function(socket_id, rooms) {// Find the room
																// the user
																// resides in
		var return_value = [];
		return_value.push(-1);
		for ( var key in rooms) {
			if (typeof rooms[key] === 'object') {
				if (search_object_key(rooms[key].sockets, socket_id) === true) {

					if (null !== rooms[key].length
							&& rooms[key].length >= min_room_size) {
						return_value.push(key);
					} else {
						// Current_socket_room
						return_value[0] = key;// Only room the user is in is
												// his own
					}

				}

			}
		}
		return return_value;

	}

}

function search_object_key(obj, value) {
	for ( var key in obj) {

		if (typeof obj[key] === 'object') {
			searchObj(obj[key]);
		}

		if (key === value) {
			return true;
		}

	}
	return false;
}

function search_object(obj, value) {
	for ( var key in obj) {

		if (typeof obj[key] === 'object') {
			searchObj(obj[key]);
		}

		if (obj[key] === value) {
			return true;
		}

	}
}

var number_in_room = 0;
var room_number = 0;
var room_min_size = 2;
var room_max_size = 2;
var wait_rooms = new waiting_rooms(room_min_size, room_max_size);

module.exports = function(io) {

	io.sockets.on('connection', function(socket) {
		var room_num = wait_rooms.add_to_room(socket);
		

		socket.join(room_num);
		
		io.to(socket.id).emit('user connect', {// Send message to user
													// based on their room
			'msg' : "You are in Room #" + room_num 
		});

		socket.on('disconnect', function() {
			console.log('user disconnected');
			var rooms = wait_rooms.find_room_by_socket_id(socket.id, rooms);
			if (rooms.length > 0) {
				io.to(rooms.pop()).emit('user connect', {
					'msg' : "User Disconnected",
					'for' : 'everyone'
				});
			} else {// Send failure message

			}
		});

		socket.on('chat message', function(msg) {
			var rooms = socket.adapter.rooms;
			rooms = wait_rooms.find_room_by_socket_id(socket.id, rooms);

			io.to(rooms.pop()).emit('chat message', {
				'msg' : msg.msg,
				'for' : 'everyone'
			});
		});
	});

};