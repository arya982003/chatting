const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', function (socket) {
    socket.on('newuser', function (username) {
        io.emit('update', username + ' joined the conversation');
    });

    socket.on('exit-chat', function (username) {
        io.emit('update', username + ' left the conversation');
    });

    // socket.on('chat', function (message) {
    //     io.emit('chat', message);
    // });
    
    socket.on('chat', function (message) {
        socket.broadcast.emit('chat', message); // Emit to all sockets except the sender
    });
    
});

const port = 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
