import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors'

const app = express()
const server = createServer(app);
const io = new Server(server,  {
    cors: {
        origin: '*',
    },
});

const ROOM = 'group';

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('joinRoom', async (userName) => {
        console.log(`${userName} is joining the group.`);

        await socket.join(ROOM);

        // send to all
        // io.to(ROOM).emit('roomNotice', userName);

        // broadcast
        socket.to(ROOM).emit('roomNotice', userName);
    });

    socket.on('chatMessage', (msg) => {
        socket.to(ROOM).emit('chatMessage', msg);
    });

    socket.on('typing', (userName) => {
        socket.to(ROOM).emit('typing', userName);
    });

    socket.on('stopTyping', (userName) => {
        socket.to(ROOM).emit('stopTyping', userName);
    });
});


app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.get('/', (req, res) => {
  res.json({message : "server is running successfully"});
})

const port = 3000
server.listen(port, () => {
  console.log(`Server + Socket.IO running on port ${port}`);
});