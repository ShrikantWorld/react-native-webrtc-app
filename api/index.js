const { Server } = require('socket.io');

module.exports = (req, res) => {
  const server = require('http').createServer();
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  });

  server.listen(3500, () => {
    console.log('Server running on port 3500');
  });

  res.status(200).send('WebSocket server running!');
};
