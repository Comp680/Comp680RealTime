/**
 * New node file
 */

var uuid = require('node-uuid');

module.exports = function waiting_rooms(min_room_size, max_room_size) {
	this.room_waiting = [0];
	this.number_in_room = 0;
	this.add_to_room = function(user_socker) {
		if(this.number_in_room >= max_room_size){
			this.room_waiting[0] = uuid.v1();
			this.number_in_room = 0;
		}
		this.number_in_room++;
		return {'room':this.room_waiting[0],'user_number':this.number_in_room,'full':this.number_in_room >= max_room_size};
		
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