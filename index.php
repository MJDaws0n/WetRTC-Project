<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <title>WebRTC</title>
</head>
<body>
  <?php if(!isset($_GET['id'])){echo '<p>Invalid personal ID</p></body></html>'; exit();}?>
  <?php if(!isset($_GET['other'])){echo '<p>Invalid other ID</p></body></html>'; exit();}?>

  <h1>WebSocket Client</h1>
  <button onclick="connect()">Connect</button>
  <p>State: <span id="state">Disconnected</span></p>
  <p>Call State: <span id="call_state">Disconnected</span></p>

  <input hidden type="text" id="input">

  <h2>Local Video</h2>
  <video id="localVideo" muted autoplay></video>

  <h2>Remote Video</h2>
  <video id="remoteVideo" autoplay></video>

  <script>
    let personalID = <?php echo json_encode($_GET['id'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE); ?>;
    let otherID = <?php echo json_encode($_GET['other'], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE); ?>;
  </script>
  <script src="script.js"></script>
</body>
</html>
