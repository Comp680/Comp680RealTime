/**
 * New node file
 */

var uuid = require('node-uuid');

module.exports = function waiting_rooms(min_room_size, max_room_size) {
	this.room_waiting = [uuid.v1()];
	this.number_in_room = 0;
	this.add_to_room = function(user_socket) {
		
		if(this.number_in_room >= max_room_size){
			this.room_waiting[0] = uuid.v1();
			this.number_in_room = 0;
		}
		this.number_in_room++;
		return {'room':this.room_waiting[0],'user_number':this.number_in_room,'full':this.number_in_room >= max_room_size};
		
	}

	this.find_room_by_socket_id = function(socket,socket_id,rooms) {// Find the room
																// the user
																// resides in
		return Object.keys(socket.adapter.sids[socket_id]);

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