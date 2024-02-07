// WebWocket code
let ws;
function connect() {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = function() {
    console.log('WebSocket connected');
  };

  ws.onmessage = function(event) {
    console.log('WebSocket sent message: ');
    console.log(JSON.parse(event.data));

    const sessionDescription = new RTCSessionDescription(JSON.parse(event.data));
    
    // Set the remote description of the peer connection
    peerConnection.setRemoteDescription(sessionDescription)
      .then(() => {
        console.log('Remote description set successfully.');
      })
      .catch(error => {
        console.error('Error setting remote description:', error);
      });

    // Listen for the 'ontrack' event
    peerConnection.ontrack = event => {
      if (!remoteVideo.srcObject) {
        setTimeout(function() {
          console.log(event.streams[0]);
          remoteVideo.srcObject = event.streams[0];
          console.log('Remote video stream set successfully.');
        }, 1000);
      }
    };
  };

  ws.onclose = function() {
    console.log('WebSocket closed');
  };
}

function sendMessage(message) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  }
}
connect();

// Camera code

var peerConnection;
var configuration;

// Initialize variables for local and remote videos
const remoteVideo = document.getElementById('localVideo');
const localVideo = document.getElementById('remoteVideo');

function handleSuccess(stream) {
  // Assign local stream to local video element
  localVideo.srcObject = stream;

  // Create RTCPeerConnection object
  configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  peerConnection = new RTCPeerConnection(configuration);

  // Add local stream to peer connection
  stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
  });

  // Set up event handlers for peer connection
  peerConnection.ontrack = event => {
      // When remote stream is added, show it in remote video element
      remoteVideo.srcObject = event.streams[0];
  };

  // Create offer
  peerConnection.createOffer()
      .then(offer => peerConnection.setLocalDescription(offer))
      .then(() => {
        console.log('Offer created:', peerConnection.localDescription);

        sendMessage(JSON.stringify(peerConnection.localDescription));
      })
      .catch(error => console.error('Error creating offer:', error));
}

// Function to handle when getUserMedia fails
function handleError(error) {
  console.error('Error accessing media devices:', error);
}

// Get user media (in this case, just video)
navigator.mediaDevices.getUserMedia({ video: true })
  .then(handleSuccess)
  .catch(handleError);