/**
 * New node file
 */
var board, game = new Chess(), statusEl = $('#status'), fenEl = $('#fen'), pgnEl = $('#pgn'), options = {
	onThisClientJoinGame : userJoin,// User joins lobby
	onRecievePacket : updateOnlineBoard, // User recieves data packet
	onGameStart : gameStart,// Lobby is full, user can begin game
	connectionStatus : connectionSuccess, // Connection has been made successfully
	onOtherUserDisconnect : null
};

var player_color;

online_chess = $.fn.ClientGame("localhost:3000", 3, options);

// Connect to the server
online_chess.connectToServer();
online_chess.joinGame("Player Joined");

function userJoin(msg){
	if(msg.player_number === 1){
		player_color = 'w';
	}else{
		player_color = 'b';
	}
}

function gameStart(msg){
	alert(msg.msg);
}

function connectionSuccess(msg){
	alert(msg.msg);
}

//Update the users board from the other persons game
function updateOnlineBoard(message) {
	//Reload the board
	board.position(message.msg.board);
	game.load(message.msg.board);
	var status = check_game_status();

	statusEl.html(status);
	fenEl.html(game.fen());
	pgnEl.html(game.pgn());
};

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function(source, piece, position, orientation) {
	if (game.game_over() === true
			|| (game.turn() === player_color && piece.search(new RegExp("/^",player_color,"/")) !== -1)) {
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