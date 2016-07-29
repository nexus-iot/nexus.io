var io = require('socket.io')();
var server = require('../src/nexus').server(io);

server.on('started', function () {
    console.log('listening');
});

server.on('device-registered', function () {
    console.log('device-registered');
});

server.on('device-unregistered', function () {
    console.log('device-unregistered');
});

var http = io.listen(8080);
