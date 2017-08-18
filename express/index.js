
'use strict';
module.exports = require('./lib/express');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var connectionList = {};
io.on('connection', function(socket){
    var socketId = socket.id;
    connectionList[socketId] = {
        socket: socket
    };

    socket.on('join', function (data) {
        socket.broadcast.emit('broadcast_join', data);
        connectionList[socketId].username = data.username;
    });

    socket.on('disconnect', function () {
        if (connectionList[socketId].username) {
            socket.broadcast.emit('broadcast_quit', {
                username: connectionList[socketId].username
            });
        }
        delete connectionList[socketId];
    });

    socket.on('say', function (data) {
        socket.broadcast.emit('broadcast_say',{
            username: connectionList[socketId].username,
            text: data.text
        });
    });
});
