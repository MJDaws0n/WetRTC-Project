const WebSocket = require('ws');

// Create a WebSocket server instance
const wss = new WebSocket.Server({ port: 8080 }); // Port can be changed as needed

var clients = [];

// Event listener for when a client connects
wss.on('connection', function connection(ws) {
  console.log('Client connected');

  // Event listener for when a message is received from the client
  ws.on('message', function incoming(data) {
    if(!isJsonString(data)){
      // Invalid JSON
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid JSON'
      }));
      return;
    }

    const message = JSON.parse(data);

    if(!message.type){
      // Undefined type
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Undefined command'
      }));
      return;
    }

    if(message.type == 'welcome'){
      if(!message.id){
        // Invalid ID
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Undefined ID'
        }));
        return;
      }

      if(!message.other){
        // Invalid ID
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Undefined other ID'
        }));
        return;
      }

      console.log('Client welcomed');

      clients.push({
        id: message.id,
        other: message.other,
        client: ws,
      });

      var wait;
      if(clients.findIndex(client => client.other === message.id) == -1 /* Not found*/ ){ // Check if the other user has alread connected
        wait = 'true';
      } else{
        wait = 'false';
      }

      // Respond
      ws.send(JSON.stringify({
        type: 'welcome',
        message: 'welcome',
        wait: wait // Says if the user has to wait for the other user to connect
      }));
      return;
    }

    if(
      message.type == 'offer' ||
      message.type == 'answer' ||
    false ){
      // Send on the offer or answer
      clients.forEach(client => {
        if(clients[clients.findIndex(cl => cl.other === client.id)].other && client.client != ws){
          client.client.send(JSON.stringify(message));
        }
      });
      return;
    }

    // Nothing has ran
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Unknown command'
    }));
    return;
  });

  // Event listener for when the client closes the connection
  ws.on('close', function close() {
    console.log('Client disconnected');

    // Remove client from client list
    const index = clients.findIndex(client => client.client === ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

function isJsonString(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

console.log('WebSocket server running on ws://localhost:8080');