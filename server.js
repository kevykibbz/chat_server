require("dotenv").config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const db = require('./db');
const handleUserChat = require('./chat');   
const handleThreadChat = require('./thread');

const app = express();
const server = http.createServer(app);

// Allow multiple origins by splitting the SERVER_URL environment variable
const allowedOrigins = process.env.SERVER_URL.split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST']
}));

// Initialize Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,  // Allow multiple origins
    methods: ['GET', 'POST']
  }
});

// Database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Backend Connected');
});

// Socket.io setup for handling user-to-user chat
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chatting among users
  handleUserChat(socket);

  // Handle chatting in a specific thread
  handleThreadChat(socket);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Test route
app.get('/test', (req, res) => {
  res.send('Server is running');
});

// Set up the server to listen on the port specified in .env, default to 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
