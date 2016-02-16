/**
 * Contains functions for the socket
 */

module.exports = function (io) {
 
	io.sockets.on('connection', function(socket) {
    
	console.log("User has connected");
	io.emit('user connect', { 'msg':"User Connected" , 'for': 'everyone' });
    socket.on('disconnect', function(){
	    console.log('user disconnected');
	    io.emit('user connect', { 'msg':"User Disconnected" , 'for': 'everyone' });
	  });
    
    socket.on('chat message',function(msg){
    	
    	io.emit('chat message', { 'msg':msg, 'for': 'everyone' });
    });
  });
	
	
	
};