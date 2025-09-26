// backend/socket.js

const { Server } = require("socket.io");

let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            // CRITICAL FIX: Allow both your local and deployed frontend URLs
            origin: ["http://localhost:3000", "https://legallink.vercel.app"],
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected via WebSocket:', socket.id);
        
        // This event allows the frontend to tell the server which user has connected
        // The user then joins a "room" named after their own unique user ID
        socket.on('join_user_room', (userId) => {
            socket.join(userId);
            console.log(`User ${socket.id} joined personal room: ${userId}`);
        });

        // This is for the live chat feature we will build later
        socket.on('join_case_room', (caseId) => {
            socket.join(caseId);
            console.log(`User ${socket.id} joined case room: ${caseId}`);
        });

        socket.on('send_message', (data) => {
            // Broadcasts a message to everyone else in the same room
            socket.to(data.room).emit('receive_message', data);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}

// This function lets other files (like your routes) get access to the 'io' instance
const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initializeSocket, getIo };