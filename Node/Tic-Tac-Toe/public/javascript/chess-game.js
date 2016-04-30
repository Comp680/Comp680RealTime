var board, game = new Chess(), statusEl = $('#status'), fenEl = $('#fen'), pgnEl = $('#pgn'),player_color_dis = $("#piece_color"), options = {
	onThisClientJoinGame : userJoin,// User joins lobby
	onRecievePacket : updateOnlineBoard, // User recieves data packet
	onGameStart : gameStart,// Lobby is full, user can begin game
	connectionStatus : connectionSuccess, // Connection has been made successfully
	onOtherUserDisconnect : OnUserDisconnect //Other player has disconnected
};

var player_color,player_color_regex,
game_started=false;

online_chess = $.fn.ClientGame("localhost:3000", "068474f0-0ef1-11e6-aac2-7f7f2ad9da18", options);

// Connect to the server
online_chess.connectToServer();
online_chess.joinGame("Player Joined");

function userJoin(msg){

}

function OnUserDisconnect(msg){
	if (confirm('Oppenent Disconnected. Would you like to play a new game?')) {
		game_started = false;
		board = ChessBoard('board', cfg);
		game = new Chess();
		update_screen_values();

		online_chess.joinGame("Player Joined");
	} else {

	}

}

function gameStart(message){
	game_started = true;
	if(message.msg.player === 1){
		player_color = 'w';
		player_color_regex = /^b/;
		player_color_dis.html("White");
	}else{
		player_color = 'b';
		player_color_regex = /^w/;
		player_color_dis.html("Black");
	}
	alert("Game Start");
}

function connectionSuccess(msg){
	$(".circle").toggleClass("connected");
	$(".circle").toggleClass("disconnected");
}

//Update the users board from the other persons game
function updateOnlineBoard(message) {
	//Reload the board
	board.position(message.msg.board);
	game.load(message.msg.board);
	update_screen_values();
};

function update_screen_values(){
	var status = check_game_status();

	statusEl.html(status);
	fenEl.html(game.fen());
	pgnEl.html(game.pgn());
}

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function(source, piece, position, orientation) {
	var temp = piece.search(player_color_regex);
	if (game.game_over() === true
			|| !game_started
			|| game.turn() !== player_color
			|| (game.turn() === player_color && piece.search(player_color_regex) !== -1)) {
		return false;
	}
};

var onDrop = function(source, target) {
	// see if the move is legal
	var move = game.move({
		from : source,
		to : target,
		promotion : 'q' // NOTE: always promote to a queen for example
						// simplicity
	});

	// illegal move
	if (move === null)
		return 'snapback';

	updateStatus();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
	board.position(game.fen());
	var current_board = {
			'board' : game.fen()
		};

		online_chess.passGameData(current_board);
};



var check_game_status = function() {
	var status='';
	var moveColor = 'White';

	if (game.turn() === 'b') {
		moveColor = 'Black';
	}

	// checkmate?
	if (game.in_checkmate() === true) {
		status = 'Game over, ' + moveColor + ' is in checkmate.';
	}
	// draw?
	else if (game.in_draw() === true) {
		status = 'Game over, drawn position';
	}
	// game still on
	else {
		status = moveColor + ' to move';

		// check?
		if (game.in_check() === true) {
			status += ', ' + moveColor + ' is in check';
		}
	}
	return status;
}

var updateStatus = function() {
	var status = '';


	status = check_game_status();

	statusEl.html(status);
	fenEl.html(game.fen());
	pgnEl.html(game.pgn());
};

var cfg = {
	draggable : true,
	position : 'start',
	onDragStart : onDragStart,
	onDrop : onDrop,
	onSnapEnd : onSnapEnd
};
board = ChessBoard('board', cfg);

updateStatus();
