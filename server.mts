import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV != "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer, {
    maxHttpBufferSize: 1e6,
  });

  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);
    socket.on("join-room", ({ room, userId }) => {
      socket.join(room);
      console.log(`User ${userId} joined room ${room}`);
    });

    socket.on("message", ({ message, room, sender, id }) => {
      socket.to(room).emit("message", { sender, message, id });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running  on http://${hostname}:${port}`);
  });
});
