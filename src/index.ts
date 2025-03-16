import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDatabase from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import errorHandler from './middleware/errorHandler';
import  authenticate from './middleware/authenticate';
import { OK } from './constants/http';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import sessionRoutes from './routes/session.route';
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
      origin: APP_ORIGIN, // Update this with your frontend URL
      methods: ["GET", "POST"],
    },
});

let onlineUsers = {} as any;

io.on("connection", (socket) => {
    socket.on("register", (userId) => {
        onlineUsers[userId] = socket.id;
        // console.log(`User registered: ${userId} -> ${socket.id}`);
        io.emit("updateOnlineUsers", Object.keys(onlineUsers));
    });
  
    socket.on("privateMessage", ({ senderId, receiverId, encryptedMessage, iv }) => {
    const receiverSocketId = onlineUsers[receiverId]; // Get recipient's socket ID
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", { senderId, encryptedMessage, iv });
    }
  });

  socket.on("logout", (userId) => {
    delete onlineUsers[userId]; // Remove user from online list
    // console.log(`❌: User ${socket.id} disconnected`);
    io.emit("updateOnlineUsers", Object.keys(onlineUsers)); // Notify all clients
    socket.disconnect(); // Manually disconnect the socket
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));    
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    })
);
app.use(cookieParser());

app.get('/', (_, res) => {
    return res.status(OK).json({
        message: 'Healthy',
    });
});

// auth routes
app.use('/auth', authRoutes);

//protected routes
app.use('/user', authenticate, userRoutes);
app.use('/sessions', authenticate, sessionRoutes);

app.use(errorHandler);

httpServer.listen (
    PORT, async () => {
        console.log(`Server is running on PORT ${PORT} in the ${NODE_ENV} environment`);
        await connectToDatabase()
    })

