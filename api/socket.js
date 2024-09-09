const { Server } = require("socket.io");
let IO;

module.exports.initIO = (server) => {
  IO = new Server(server, {
    cors: {
      origin: "*",  // adjust this based on your environment
      methods: ["GET", "POST"]
    }
  });

  IO.use((socket, next) => {
    const callerId = socket.handshake.query.callerId;
    if (callerId) {
      socket.user = callerId;
      next();
    } else {
      next(new Error("No callerId provided"));
    }
  });

  IO.on("connection", (socket) => {
    console.log(`${socket.user} Connected`);
    socket.join(socket.user);

    socket.on("call", (data) => {
      const { calleeId, rtcMessage } = data;
      socket.to(calleeId).emit("newCall", {
        callerId: socket.user,
        rtcMessage
      });
    });

    socket.on("answerCall", (data) => {
      const { callerId, rtcMessage } = data;
      socket.to(callerId).emit("callAnswered", {
        callee: socket.user,
        rtcMessage
      });
    });

    socket.on("ICEcandidate", (data) => {
      const { calleeId, rtcMessage } = data;
      socket.to(calleeId).emit("ICEcandidate", {
        sender: socket.user,
        rtcMessage
      });
    });

    socket.on("disconnect", () => {
      console.log(`${socket.user} Disconnected`);
    });
  });
};

module.exports.getIO = () => {
  if (!IO) {
    throw new Error("IO not initialized.");
  }
  return IO;
};
