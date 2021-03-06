/**
 * New node file
 */



function emit_new_message(socket, msg, emit_to){
	var rooms = socket.adapter.rooms;
	rooms = wait_rooms.find_room_by_socket_id(socket.id, rooms);
	if(msg['for'].toLowerCase()=='not_me'){
		socket.broadcast.to(rooms.pop()).emit(emit_to, {
			'msg' : msg.msg,
		});
	}else{
		socket.to(rooms.pop()).emit(emit_to, {
			'msg' : msg.msg,
		});
	}
}

var number_in_room = 0;
var room_number = 0;
var room_min_size = 2;
var room_max_size = 2;
var wait_rooms = new waiting_rooms(room_min_size, room_max_size);


module.exports = function(io) {
	
	io.sockets.on('connection', function(socket) {
		socket.emit('connection_status',"Connection Successful");//Send information about successful connection
	});
	
	socket.on('disconnect', function(socket) {
		
		
	});
	
	// User wants to join a game
	socket.on('join_game',function(msg){
		var room_info = wait_rooms.add_to_room(socket);
		var room_num = room_info.room;

		socket.join(room_num);
		
		io.to(socket.id).emit('user connect', {// Send message to user
													// based on their room
			'msg' : msg.msg,
			'room_number': room_num,
			'player_number':room_info.user_number
		});
		});
	
	socket.on('user_disconnecting', function(msg) {
		var rooms = wait_rooms.find_room_by_socket_id(socket.id, rooms);
		if (rooms.length > 0) {
			io.to(rooms.pop()).emit('user connect', {
				'msg' : msg.msg
			});
		} else {// Send failure message

		}
	});
	
	socket.on('game_message',function(msg){// Emit a game message
		emit_new_message(socket, msg.msg,'game_update');
	});
	
	
	
}