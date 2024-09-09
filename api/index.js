const path = require('path');
const express = require('express');
const { initIO } = require('./socket');
const { createServer } = require('http');

// Create express app
const app = express();

// Serve static files (adjust the path as per your project)
app.use('/', express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.send('Signaling server is running.');
});

// Serverless function handler
module.exports = (req, res) => {
  const server = createServer(app);

  // Initialize WebSocket (for each request in serverless environment)
  initIO(server);

  // Handle the Express request
  app(req, res);
};
