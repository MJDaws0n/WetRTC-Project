const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle GET request for video chat page
app.get('/video_chat.html', (req, res) => {
  const { yourID, otherID } = req.query;
  // Render video chat page with identifiers passed as parameters
  res.sendFile(path.join(__dirname, 'public', 'video_chat.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
