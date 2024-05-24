const express = require('express');
const app = express();

const port = 8080;
const server = app.listen(port, function() {
    console.log('Listening on ' + port);
});

const SocketIO = require('socket.io');
const io = SocketIO(server, { path: '/socket.io' });

app.use(express.static(__dirname)); // 현재 디렉토리에서 정적 파일 제공

app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket) {
    console.log(socket.id + ' connected...');

    // 채팅방에 들어온 메시지를 모든 사용자에게 방송
    io.emit('msg', `${socket.id} has entered the chatroom.`);

    // 메시지 수신
    socket.on('msg', function(data) {
        console.log(socket.id + ': ', data);
        // 보낸 사람을 제외한 모든 사용자에게 메시지 방송
        socket.broadcast.emit('msg', `${socket.id}: ${data}`);
    });

    // 사용자 연결 해제
    socket.on('disconnect', function() {
        io.emit('msg', `${socket.id} has left the chatroom.`);
    });
});
