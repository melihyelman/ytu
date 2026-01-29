const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http'); 
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// Routes
const authRoutes = require('./routes/authRoutes');
const sensorRoutes = require('./routes/sensorRoutes');

dotenv.config();
// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app); 

// Socket.io Kurulumu
const io = new Server(server, {
    cors: {
        origin: "*", // Birden fazla origin desteklemesi için split eklendi
        methods: ["GET", "POST"]
    }
});

// Socket.io bağlantısını global yap (Controller'dan erişmek için)
app.set('io', io); 

// Socket.io Authentication Middleware
io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
        jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET || 'gizliAnahtar123', (err, decoded) => {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
});

// Middleware
app.use(cors({
    origin: "*",
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensor', sensorRoutes);

// Default Route
io.on('connection', (socket) => {
    console.log('Yeni bir istemci bağlandı:', socket.id);

    // Kullanıcıyı kendi "Room"una (kanalına) al
    // socket.decoded.id, middleware'den geliyor (JWT'den çözüldü)
    if (socket.decoded && socket.decoded.id) {
        const userId = socket.decoded.id;
        socket.join(userId);
        console.log(`Kullanıcı ${userId} kendi odasına katıldı.`);
    }
    
    socket.on('disconnect', () => {
        console.log('İstemci ayrıldı:', socket.id);
    });
});

const PORT = process.env.PORT || 5001;

// app.listen DEĞİL, server.listen kullanıyoruz
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
