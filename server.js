const express = require("express");
const app = express();
const { v4: uuidV4 } = require("uuid");
const server = require("http").Server(app);
const io = require("socket.io")(server);

const host = "0.0.0.0";
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

server.listen(port, host, () => {
  console.log(`Server running at https://${host}:${port}/`);
});
