/**
 * Contains functions for the socket
 */
var number_in_room = 0;
var room_number = 0;
var room_min_size = 2;
module.exports = function(io) {

	io.sockets.on('connection', function(socket) {

		if (number_in_room >= room_min_size) {
			room_number++;
			number_in_room=0;
		}

		socket.join(room_number)
		number_in_room++;
		io.to(room_number).emit('user connect', {
			'msg' : "You are in Room #" + room_number
		});

		socket.on('disconnect', function() {
			console.log('user disconnected');
			io.to(0).emit('user connect', {
				'msg' : "User Disconnected",
				'for' : 'everyone'
			});
		});

		socket.on('chat message', function(msg) {
			var rooms = socket.adapter.rooms;
			rooms = find_room_by_socket_id(socket.id, rooms);
			
			
			io.to(rooms.pop()).emit('chat message', {
				'msg' : msg.msg,
				'for' : 'everyone'
			});
		});
	});

	function find_room_by_socket_id(socket_id, rooms) {
		var return_value = [];
		return_value.push(-1);
		for ( var key in rooms) {
			if (typeof rooms[key] === 'object') {
				if (search_object_key(rooms[key].sockets,socket_id)===true) {

					if (null !== rooms[key].length
							&& rooms[key].length >= room_min_size) {
						return_value.push(key);
					} else {
						// Current_socket_room
						return_value[0] = key;
					}

				}

			}
		}
		return return_value;

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

};