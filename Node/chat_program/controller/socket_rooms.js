var uuid = require('node-uuid');
var mongoose = require('mongoose');
mongoose.createConnection()
/**
 * Contains information about the current room which has been created
 * 
 * @param {string|number}
 *            room_id - The id of the room which has been created
 * @constructor
 * @return {Object}
 */
function room_information_container(room_id) {
	/**
	 * Store the time at which the room was created
	 */
	this.created = (new Date()).getTime();
	/**
	 * Stores the current id of the room
	 */
	this.id = room_id;
	this.ready = false;
	return this;
}



/**
 * Contains information about the current room which has been created
 * 
 * @param {number}
 *            min_room_size - The smallest possible room size
 * @param {number}
 *            max_room_size - The maximum size of the room
 * @constructor
 * @return {waiting_rooms}
 */
function waiting_rooms(min_room_size, max_room_size) {
	/**
	 * A two-level array containing a game_id pointing to an arrays containing
	 * the rooms which have been created for that game
	 * 
	 * @access private
	 */
	this.games = [];
	this.number_in_room = 0;

	/**
	 * Place a new user into a new game room
	 * 
	 * @param {socket}
	 *            user_socket - The socket to be added to a game
	 * @param {number}
	 *            game_id - The id of the game to which the user should be added
	 * @return {JSON}
	 * @access public
	 */
	this.add_to_room = function(user_socket, game_id) {

		// room_information_container
		var open_room = this.find_open_rooms(user_socket, game_id);

		user_socket.join(open_room.id);
		this.number_in_room++;
		return {
			'room' : open_room,
			'user_number' : this.number_in_room,
			'full' : open_room.ready
		};

	}

	/**
	 * Find rooms with the given game id which are open and creates rooms when
	 * none are available
	 * 
	 * @param {socket}
	 *            socket - The socket to which the client is attached
	 * @param {number|string}
	 *            game_id - The id of the game which requires a room
	 * @return {room_information_container}
	 */
	this.find_open_rooms = function(socket, game_id) {
		// List of all rooms available
		var rooms = socket.adapter.rooms;
		var available_rooms;
		if (this.games.length === 0
				|| typeof this.games[game_id] === 'undefined') {
			// Create a new list if the game_id has no games
			this.games[game_id] = [];
			return this.add_a_new_room(game_id);
		} else if (this.games[game_id].length === 0) {
			// Add a new room to the game, as it has none
			return this.add_a_new_room(game_id);
		} else {
			// Find a list of open rooms
			available_rooms = this.games[game_id].filter(function(element,
					index, array) {
				// Element is a room_information_container
				if (typeof rooms[element.id] === 'undefined') {
					delete array[index];
				} else {
					if (rooms[element.id].length < min_room_size) {
						if (rooms[element.id].length + 1 >= min_room_size) {
							element.ready = true;
							delete array[index];
						}
						return element;
					}
				}
			});

			if (available_rooms.length === 0) {
				// In case all rooms turn out to not exist
				return this.add_a_new_room(game_id);
			} else {
				return available_rooms[0];
			}
		}
	}
	/**
	 * Create a new room for the users
	 * 
	 * @param {number|string}
	 *            game_id - The id of the game which requires a room
	 * @access private
	 * @return {room_information_container}
	 */
	this.add_a_new_room = function(game_id) {
		var info = new room_information_container(uuid.v1());
		this.games[game_id].push(info);
		return info;
	}

	/**
	 * Find rooms the socket, and therefore the client, is in
	 * 
	 * @param {socket}
	 *            socket - The socket to which the client is attached
	 * @param {string}
	 *            socket_id - The id of the socket to which the client is
	 *            attached
	 * @return {array} Contains list of rooms containing the current user
	 */
	this.find_room_by_socket_id = function(socket, socket_id) {// Find the room
		// the user
		// resides in
		var room_temp = socket.adapter.sids[socket_id];
		return Object.keys(room_temp);

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

module.exports = waiting_rooms;