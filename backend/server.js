const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path")
const app = express();
const cors = require("cors");
dotenv.config();
connectDB();
app.use(express.json());
app.use(cors());



app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);



// ----------------------------DEPLOYMENT-----------------------------------

const _dirname1 = path.resolve();
if(process.env.NODE_ENV){
  app.use(express.static(path.join(_dirname1,'frontend/build')))
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(_dirname1,"frontend","build","index.html"))
  })
}
else{
  app.get("/", (req, res) => {
    res.send("API is running Successfully");
  });
}



// ----------------------------DEPLOYMENT-----------------------------------







app.use(notFound);
app.use(errorHandler);

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id == req.params.id);
  res.send(singleChat);
});

const PORT = process.env.PORT ;

const server = app.listen(
  PORT,
  console.log(`server started on PORT ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
    socket.off("setup", () => {
      console.log("User Disconnected");
      socket.leave;
    });
  });
});