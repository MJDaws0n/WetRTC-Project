// WebWocket code
let ws;
function connect() {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = function() {
    console.log('WebSocket connected');
  };

  ws.onmessage = function(event) {
    console.log('WebSocket sent message: ');

    const message = JSON.parse(event.data);

    if(message.type == 'offer'){
      console.log('Offer recived');
      input.value = JSON.stringify(message.data);
      createAnswer(JSON.parse(input.value))
      .then(() => {
        createAnswer(JSON.parse(input.value))
        .then((value) => {
          input.value = JSON.stringify(value);

          sendMessage(JSON.stringify({
            'type': 'answer',
            'data': JSON.parse(JSON.stringify(value))
          }));
        });
      });
    } else if(message.type == 'answer'){
      console.log('Answer recived');
      addAnswer(message.data);
    }
  };

  ws.onclose = function() {
    console.log('WebSocket closed');
  };
}
function sendMessage(message){
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  }
}
connect();

// Camera code
let peerConnection = new RTCPeerConnection()
let localStream;
let remoteStream;

const input = document.getElementById('input');

async function init(){
  localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
  remoteStream = new MediaStream()
  document.getElementById('localVideo').srcObject = localStream
  document.getElementById('remoteVideo').srcObject = remoteStream

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };
}

let newOffer;
async function createOffer(){
  console.log('Offer made');
  peerConnection.onicecandidate = async (event) => {
    if(event.candidate){
      newOffer = (JSON.stringify(peerConnection.localDescription));
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
}

let newAnswer;
async function createAnswer(offer){
  console.log('Answer made');
  peerConnection.onicecandidate = async (event) => {
    if(event.candidate){
        newAnswer = JSON.stringify(peerConnection.localDescription)
    }
  };

  await peerConnection.setRemoteDescription(offer);

  let answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer); 
  return answer;
}

async function addAnswer(answer){
  console.log('Answer added');
  if (!peerConnection.currentRemoteDescription){
    peerConnection.setRemoteDescription(answer);
  }
}

init();

function load(){
  if(document.getElementById('isHost').checked){
    createOffer()
    .then((value) => {
      sendMessage(JSON.stringify({
        'type': 'offer',
        'data': value
      }));
    });
  }
}