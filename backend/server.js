// backend/server.js

const express = require('express');
const http = require('http');
const { initializeSocket, getIo } = require('./socket');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();
const server = http.createServer(app);

initializeSocket(server);

// --- Middleware ---
const corsOptions = {
  origin: ["http://localhost:3000", "https://legallink.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type', 'x-auth-token']
};
app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    req.io = getIo();
    next();
});

// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully!');
    } catch (err) {
        console.error('MongoDB Connection Failed:', err.message);
        process.exit(1);
    }
};
connectDB();

// --- Define Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lawyer', require('./routes/lawyer'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/client', require('./routes/client'));
app.use('/api/consultations', require('./routes/consultation'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/messages', require('./routes/message')); // <-- THIS LINE FIXES THE 404 ERROR

// --- Serve Static Files ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server with WebSocket is running on port ${PORT}`));