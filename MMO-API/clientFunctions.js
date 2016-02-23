/**
 * http://usejsdoc.org/
 */

// Establish connection to server - first function that needs to be called by client
function connectToServer() {
	
}

// Terminate connection to server - if game is in in progress, notifies other clients this client has disconnected
function disconnectFromServer() {
	
}

// Declare to server that client wishes to join next available game
// if no game is available, initiate game. else add client to existing wait lobby until lobby has been filled 
function joinGame() {
	
}

// Pass data in the form of a JSON object to server to pass to other client(s)
function passData(UUID otherClient) {
	
}

// Whenever client connects to server, it gets a UUID so each client can be identified
function getUUID() {
	
}

// timed keep alive letting server know that client is still connected - client must call this function every TBD after connection
function timingUpdate() {
	
}

