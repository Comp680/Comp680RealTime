/**
 * http://usejsdoc.org/
 */

/*
 * Object containing all information needed to connect and recieve message from
 * the backend
 */
(function($) {
	var version = '0.0.1';



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
	 * @param {function}
	 *            [options.onThisClientJoinGame] - Another user has
	 *            disconnected from the game
	 *  @exception Missing IP Address
	 *  @exception Missing Game ID error
	 *  @return {Object}
	 */
	$.fn.ClientGame = function(server, game_id, options) {

		/**
		 * Creates the message for the backend server
		 * @access private
		 * @param {string|JSON} msg - The message which will be added to the server data
		 */
		function create_message(msg) {

			return {
				'msg' : msg,
				'version_num' : version,
				'for' : 'not_me',
				'game_id': game_id
			};

		}

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
			onOtherUserDisconnect : null, //On any other user disconnect
			onThisClientJoinGame: null //On joining a game
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
				/**
				 * A user has joined the game the current user is in
				 * @event $.fn.ClientGame#user_join
				 * @property msg {*} - A message from the server stating the users connection status
				 */
				this.socket.on('connection_status',
						this._options.connectionStatus);
			}

			if (this._options.onUserJoin !== null) {// Create callback for user
													// join
				/**
				 * A user has joined the game the current user is in
				 * @event $.fn.ClientGame#user_join
				 * @property msg {*} - The message sent by the client at join
				 */
				this.socket.on('user_join', this._options.onUserJoin);
			}

			if (this._options.onRecievePacket !== null) {
				/**
				 * A message containing information about the current game has been received
				 * @event $.fn.ClientGame#game_update
				 * @type {object}
				 * @property msg {*} - The message sent another user
				 */
				this.socket.on('game_update', this._options.onRecievePacket);
			}

			if (this._options.onGameStart !== null) {
				/**
				 * A user has joined the game the current user is in
				 * @event $.fn.ClientGame#game_start
				 * @type {object}
				 * @property {*} msg - A message the user has set as default
				 * @property {number} player - The player's number in the game
				 */
				this.socket.on('game_start', this._options.onGameStart);
			}

			if (this._options.onOtherUserDisconnect !== null) {
				/**
				 * A user has joined the game the current user is in
				 * @event $.fn.ClientGame#user_disconnected
				 * @property msg {*} - The message sent by the client at join
				 */
				this.socket.on('user_disconnected',
						this._options.onOtherUserDisconnect);
			}

			if(this._options.onThisClientJoinGame !== null) {
				/**
				 * A user has joined the game the current user is in
				 * @event $.fn.ClientGame#you_join
				 * @property {*} msg - Message sent by the user
				 * @property {number} player - the number of the player
				 */
				this.socket.on('you_join',
						this._options.onThisClientJoinGame);

			}


		}

		/**
		 * Terminate connection to server - if game is in in progress, notifies
		 * other clients this client has disconnected
		 *
		 * @param {JSON|string}
		 *            msg - the json object containing information to send to
		 *            other users
		 * @fires $.fn.ClientGame#user_disconnecting
		 */
		this.disconnectFromServer = function(msg) {
			/**
			@event $.fn.ClientGame#user_disconnecting
			@type {object}
			@property msg - The message of the user
			*/
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
		 * @fires $.fn.ClientGame#join_game
		 */
		this.joinGame = function(join_msg) {
			/**
			@event $.fn.ClientGame#join_game
			@type {object}
			@property msg - The message of the user
			*/
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
		 * @fires $.fn.ClientGame#game_message
		 */
		this.passGameData = function(msg) {
			/**
			@event $.fn.ClientGame#game_message
			@type {object}
			@property msg - The message of the user
			*/
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

	/**
	 * Allows the user to log into the service utilizing a username and password combination
	 * @param {string} username - The user username
	 * @param {password} password - The password of the user
	 * @callback  {LoginSuccessCallback} success - callback function performed on successfully connecting
	 * @callback {LoginFailureCallback} failure - callback function performed on failure to connect
	 */
	this.login = function(username, password,success,failure){
			var ops = {
				"success":success,
				"error":failure,
				"method":"POST",
				"data":{
					"username":username,
					"password":password
				}
			}

		$.ajax( server + "/login", ops)
	}
	/**
	This callback is for success on login
	@callback LoginSuccessCallback
	@param {Anything} data - The data returned by the server
	@param {String} textStatus - The status of the server data
	@param {jqXHR} jqXHR
	*/

	/**
	This callback is for failure on login
	@callback LoginFailureCallback
	@param {jqXHR} jqXHR - string describing the type of error that occurred and an optional exception object
	@param {String} textStatus - The status of the server data
	@param {String} errorThrown - The error thrown by the server
	*/

}(jQuery));
