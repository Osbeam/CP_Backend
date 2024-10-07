require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./src/route");
const socketIO = require('socket.io');
const http = require('http');


const app = express();
app.use('/uploads', express.static('uploads'))
const PORT = process.env.PORT || 5005;


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());




// connecting with database
const mongoose = require("mongoose");
// mongoose.connect(process.env.DB_STRING
// ).then(()=>{
//     console.warn("db connection done")
// })

const connectWithRetry = () => {
  mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  });
};

// Start the initial connection attempt
connectWithRetry();





const server1 = http.createServer(app);
const io = socketIO(server1, {
  cors: {
    origin: "*",
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("connectSocket", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    });
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  }); 
});

// Make `io` available to your routes
app.use((req, res, next) => {
  req.io = io;
  next();
});


app.get("/", (req, res) => res.send(`Server running on  ${PORT}`));
app.use("/api", routes);
app.all("*", (req, res) => res.status(404).json({ error: "404 Not Found" }));  




// const server = app.listen(PORT, () =>
//   console.log(`Server running on ${process.env.BACKEND_URL}`)
// );

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
