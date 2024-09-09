const path = require('path');
const { createServer } = require('http');
const express = require('express');
const { initIO } = require('./socket');

const app = express();
const server = createServer(app);

// Serve static files from 'public' directory
app.use('/', express.static(path.join(__dirname, '../public')));

// Initialize WebSocket
initIO(server);

app.get('/', (req, res) => {
  res.send('Signaling server is running.');
});

module.exports = (req, res) => {
  // Vercel serverless function handler
  server.listen(process.env.PORT || 3500, () => {
    console.log('Server started');
  });
  app(req, res);
};
