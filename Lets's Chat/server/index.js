// Server to handle io connections
// Requiring io io
const port = process.env.PORT || 3000;
const io = require("socket.io")(3000, {
  cors: {
    origin: "http://127.0.0.1:5500", // Change this to the client origin
    methods: ["GET", "POST"],
  },
});

// Creating a user objects
const users = {};

// Handling event on connection
io.on("connection", (socket) => {
  socket.on("newUserAdd", (newUserName) => {
    //  Adding user id in dataBase
    if (newUserName != null) {
      users[socket.id] = newUserName;
    }
    // Sending message to all others client
    socket.broadcast.emit("userAdd", newUserName);
  });

  //   User sending message
  socket.on("send", (message) => {
    //  Sending message to all
    socket.broadcast.emit("receive", {
      message: message,
      userName: users[socket.id],
    });
  });
  // User left
  socket.on("disconnect", () => {
    console.log("Hello")
    socket.broadcast.emit("left", {
      userName: users[socket.id],
    });
  });
});
