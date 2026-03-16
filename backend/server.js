require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: '*', // We'll tightly couple this in production
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io Logic
const activeUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // When a user logs in, they join a room with their userId
    socket.on('join_room', (userId) => {
        socket.join(userId);
        activeUsers.set(userId, socket.id);
        console.log(`User ${userId} joined room`);
    });

    socket.on('send_message', (data) => {
        // data: { sender, receiver, content, item }
        console.log('Message sent:', data);
        // Send to receiver's room if they are online
        io.to(data.receiver).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
