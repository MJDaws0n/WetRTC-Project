const WebSocket = require('ws');

// Create a WebSocket server instance
const wss = new WebSocket.Server({ port: 8080 }); // Port can be changed as needed

var clients = [];

// Event listener for when a client connects
wss.on('connection', function connection(ws) {
  console.log('Client connected');
  clients.push(ws);

  // Event listener for when a message is received from the client
  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);

    // Send to all clients
    clients.forEach(client => {
      client.send(message.toString());
    });
  });

  // Event listener for when the client closes the connection
  ws.on('close', function close() {
    console.log('Client disconnected');

    // Remove client from client list
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

console.log('WebSocket server running on ws://localhost:8080');