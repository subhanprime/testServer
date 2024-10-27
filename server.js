require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const router = require("./routes/index.routes");
const { authenticateToken } = require("./middleware/authentication");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use("/api", router);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("chat message", (msg) => {
    const messageData = {
      text: msg,
      senderId: socket.id,
    };
    socket.broadcast.emit("chat message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
