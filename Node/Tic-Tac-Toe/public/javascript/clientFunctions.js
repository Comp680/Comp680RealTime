/**
 * http://usejsdoc.org/
 */

/*
 * Object containing all information needed to connect and recieve message from
 * the backend
 */
(function($) {
	var version = '0.0.1';

	function create_message(msg) {

		return {
			msg : msg,
			version_num : version
		};

	}

	/**
	 * Contains everything required to create an connection to the server
	 * 
	 * @constructor
	 * @param {string}
	 *            Server - the server to send information to
	 * @param {number}
	 *            game_id - The ID of your game provided through the portal
	 * @param {Object}
	 *            options - JSON object containing information about the object
	 * @param {function}
	 *            [options.onUserJoin] - User joins lobby
	 * @param {function}
	 *            [options.onRecievePacket] - User recieves data packet
	 * @param {function}
	 *            [options.onGameStart] - Lobby is full, user can begin game
	 * @param {function}
	 *            [options.connectionStatus] - Connection has been made
	 *            successfully
	 * @param {function}
	 *            [options.onOtherUserDisconnect] - Another user has
	 *            disconnected from the game
	 *  @exception Missing IP Address
	 *  @exception Missing Game ID error
	 *  @return {Object}
	 */
	$.fn.ClientGame = function(server, game_id, options) {

		if (server == null) {
			throw new error(
					"An ip address/web domain is required. Please enter a server address.");
		}

		if (game_id == null) {
			throw new error(
					"A id for your game is required. Please pass in a game id.");
		}

		/*
		 * Contains functions which will be called when information is recieved
		 * from the server
		 * 
		 */
		this._options = {
			onUserJoin : null,// User joins lobby
			onRecievePacket : null, // User recieves data packet
			onGameStart : null,// Lobby is full, user can begin game
			connectionStatus : null, // Connection has been made successfully
			onOtherUserDisconnect : null
		// Another user has disconnected from the game
		};

		// Merge the objects together
		$.extend(this._options, this._options, options);

		this.socket; // The local socket
		this.timeout; // The timer on which updates occur
		/**
		 * Establish connection to server - first function that needs to be
		 * called by client
		 */
		this.connectToServer = function() {
			this.socket = io.connect(server);// Create a socket

			if (this._options.connectionStatus !== null) {
				this.socket.on('connection_status',
						this._options.connectionStatus);
			}

			if (this._options.onUserJoin !== null) {// Create callback for user
													// join
				this.socket.on('user_join', this._options.onUserJoin);
			}

			if (this._options.onRecievePacket !== null) {
				this.socket.on('game_update', this._options.onRecievePacket);
			}

			if (this._options.onGameStart !== null) {
				this.socket.on('game_start', this._options.onGameStart);
			}

			if (this._options.onOtherUserDisconnect !== null) {
				this.socket.on('user_disconnected',
						this._options.onOtherUserDisconnect);
			}

		}

		/**
		 * Terminate connection to server - if game is in in progress, notifies
		 * other clients this client has disconnected
		 * 
		 * @param {JSON|string}
		 *            msg - the json object containing information to send to
		 *            other users
		 */
		this.disconnectFromServer = function(msg) {
			this.socket.emit("user_disconnecting", create_message(msg));
			window.clearTimeout(this.timeout);
			// delete socket;
		}

		/**
		 * Declare to server that client wishes to join next available game if
		 * no game is available, initiate game. else add client to existing wait
		 * lobby until lobby has been filled
		 * 
		 * @param {JSON|string}
		 *            join_msg - the json object containing information to send
		 *            to other users
		 * 
		 */
		this.joinGame = function(join_msg) {
			this.socket.emit("join_game", create_message(join_msg));

		}

		// Pass data in the form of a JSON object to server to pass to other
		// client(s)
		this.passData = function(UUIDotherClient) {

		}

		// Whenever client connects to server, it gets a UUID so each client can
		// be identified
		this.getUUID = function() {

		}

		/**
		 * Allows a client to send a message to currently active game
		 * 
		 * @param {JSON|string}
		 *            msg - the json object containing information to send to
		 *            other users
		 */
		this.passGameData = function(msg) {
			this.socket.emit("game_message", create_message(msg));
		}

		/**
		 * Timed keep alive letting server know that client is still connected -
		 * client must call this function every TBD after connection
		 * 
		 * @param {number}
		 *            seconds - number seconds between keep alive messages
		 */
		this.timingUpdate = function(seconds) {
			this.timeout = window.setTimeout(function() {
				this.socket.emit('keep_alive');
			}, second * 1000);
		}
		return this;
	}

}(jQuery));
