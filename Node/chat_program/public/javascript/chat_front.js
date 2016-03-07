var socket = io.connect();//Create a socket
var room;
//Send a message
$("form").submit(function(event){
	socket.emit('chat message', {'msg':$('#m').val(),'room':room});
	$('#m').val('');
	event.preventDefault();
	return false;
});

//Find returned messages
socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg.msg));
  });

socket.on('user connect', function(msg){
	room = msg.room;
	$('#messages').append($('<li><b>' + msg.msg + '</b></li>'));
});

