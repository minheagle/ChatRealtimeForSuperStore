import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import "dotenv/config";

import authRoute from "./routes/auth.js";
import chatRoute from "./routes/chat.js";
import messageRoute from "./routes/message.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://127.0.0.1:3000", "https://super-store-hmh.vercel.app"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://super-store-hmh.vercel.app",
    ],
    credentials: true,
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("add-user", (userId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === userId)) {
      activeUsers.push({ userId: userId, socketId: socket.id });
      console.log("Active Users", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    // console.log("Sending from socket to :", receiverId);
    // console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});
