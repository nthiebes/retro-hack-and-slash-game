const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.send('<h1>Nothing to see here</h1>');
});

const ridane = io.of('/ridane');

ridane.on('connection', function(socket) {
    console.log('a user connected');

    socket.join('room0');

    socket.on('move', function(pos) {
        socket.broadcast.to('room0').emit('move', pos);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

http.listen(9000, function() {
    console.log('listening on *:9000');
});
