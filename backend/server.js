// server.js - minimal Express server
const express = require("express");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());
app.use(cors());

const gameRoutes = require("./routes/gameRoutes");
app.use("/api/game", gameRoutes);

const server = http.createServer(app);

const io = new Server(server, {
   cors: { 
    origin: '*' 
  } 
});

global.io = io;

io.on("connection", (socket) => {
  console.log('User CONNECTED:', socket.id);

  // socket.on('ping_from_client', (payload) => {
  //   console.log('ping from client:', payload);
  //   socket.emit('pong_from_server', { message: 'pong!', received: payload });
  // });

  socket.on('joinRoom', (roomCode) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room ${roomCode}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


app.get('/', (req, res) => {
  res.send('Hello — Axxela Trading Game backend is alive!');
});

app.post('/api/register', (req, res) => {
    const username = req.body.username;

    res.json({
        message: "User registered successfully",
        user: username
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});



// Example of a route with a path/URL parameter
// app.get('/api/hello/:name', (req, res) => {
//     const username = req.params.name;
//     res.json({
//         message: `Hello, ${username}!`
//     });
// });


// Example of a route with a query parameter
// app.get('/api/search', (req, res) => {
//     const {q} = req.query;
//     res.json({
//         query: q,
//         result: `You searched for ${q}`
//     });
// });