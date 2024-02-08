// WebWocket code
let ws;
function connect() {
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = function() {
    console.log('WebSocket connected');
    sendMessage(JSON.stringify({
      type: 'welcome',
      id: personalID,
      other: otherID
    }));
    document.getElementById('state').innerText = 'Connected';
  };

  ws.onmessage = function(event) {
    console.log('WebSocket sent message: ');

    const message = JSON.parse(event.data);

    if(message.type == 'welcome'){
      if(message.wait == 'true'){
        console.log('Connected to server successfully. Waiting for other client');
      } else{
        console.log('Connected to server successfully. Connecting to other client');
        load();
      }
    }

    if(message.type == 'offer'){
      console.log('Offer recived');
      input.value = JSON.stringify(message.data);

      createAnswer(message.data)
      .then((value) => {
        setTimeout(()=>{
          sendMessage(JSON.stringify({
            type: 'answer',
            data: input.value 
          }));
        }, 500)
      });
      document.getElementById('call_state').innerText = 'Connected';
    }
    
    if(message.type == 'answer'){
      console.log('Answer recived');

      input.value = message.data;

      addAnswer(JSON.parse(input.value));

      document.getElementById('call_state').innerText = 'Connected';
    }
  };

  ws.onclose = function() {
    console.log('WebSocket closed');
    document.getElementById('state').innerText = 'Connected';
  };
}
function sendMessage(message){
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  }
}

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
  peerConnection.onicecandidate = async (event) => {
    if(event.candidate){
      console.log('Offer made');
      newOffer = (JSON.stringify(peerConnection.localDescription));
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
}

async function createAnswer(offer){
  console.log('Answer made');
  peerConnection.onicecandidate = async (event) => {
    if(event.candidate){
      input.value = JSON.stringify(peerConnection.localDescription)
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
  createOffer()
  .then((value) => {
    sendMessage(JSON.stringify({
      type: 'offer',
      data: value
    }));
  });
}