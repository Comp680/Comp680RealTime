/**
 * http://usejsdoc.org/
 */

// Object containing all information needed to connect and recieve message from
// the backend
(function($) {
	var version = '0.0.1';
	
	function create_message(msg){
			
		return {msg:msg,
			version_num:version
		};
			
	}
	
	//Server - the server to send information to
	//options - JSON object containing information about the object
	$.fn.ClientGame = function(server,game_id,options) {
		
		if(server==null){
			throw new error("An ip address/web domain is required. Please enter a server address.");
		}
		
		if(game_id==null){
			throw new error("A id for your game is required. Please pass in a game id.");
		}
		
		this._options = {
				onUserJoin: null,//User joins lobby
				onRecievePacket:null, //User recieves data packet
				onGameStart:null,//Lobby is full, user can begin game
				connectionStatus:null //Connection has been made successfully
		};
		
		//Merge the objects together
		$.extend(_options,_options,options);
		
		this.socket; // The local socket
		this.timeout; // The timer on which updates occur
		// Establish connection to server - first function that needs to be
		// called by client
		// Handler - callback function in the form callback(msg)
		function connectToServer() {
			this.socket = io.connect(server);// Create a socket
			
			if(this._options.connectionStatus !==null){
				socket.on('connection_status',connectionStatus(msg));
			}
			
			if(this._options.onUserJoin!==null){//Create callback for user join
				socket.on('user_join',_options.onUserJoin(msg));
			}
			
			if(this._options.onRecievePacket!==null){
				socket.on('game_updatemsg.', _options.onRecievePacket(msg));
			}
			
			if(this._options.onGameStart!==null){
				socket.on('game_start',_options.onGameStart(msg));
			}
			
			
		}

		// Terminate connection to server - if game is in in progress, notifies
		// other clients this client has disconnected
		// msg - the json object containing information to send to other users
		function disconnectFromServer(msg) {
			socket.emit("user_disconnecting",create_message(msg));
			window.clearTimeout(this.timeout);
			delete socket;
		}

		// Declare to server that client wishes to join next available game
		// if no game is available, initiate game. else add client to existing
		// wait lobby until lobby has been filled
		// join_msg - the json object containing information to send to other
		// users
		// game_callback - callback function in the form function(msg), should
		// contain what to do once the game has started
		function joinGame(join_msg) {
			socket.emit("join_game",create_message(join_msg));
			
		}

		// Pass data in the form of a JSON object to server to pass to other
		// client(s)
		function passData(UUIDotherClient) {
			
		}

		// Whenever client connects to server, it gets a UUID so each client can
		// be identified
		function getUUID() {

		}
		
		//Allows a client to send a message to currently active game
		function passGameData(msg){
			socket.emit("game_message",create_message(msg));
		}

		// timed keep alive letting server know that client is still connected -
		// client must call this function every TBD after connection
		// seconds - number seconds between keep alive messages
		function timingUpdate(seconds) {
			this.timeout = window.setTimeout(function(){
				socket.emit('keep_alive');
			},second*1000);
		}
	}
}(jQuery));
