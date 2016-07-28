var server = require('../src/nexus').server;

var opts = {
    port: 8080
};

server.start(opts);

server.on('started', function () {
    console.log('listening');
});

server.on('device-registered', function () {
    console.log('device-registered');
});

server.on('device-unregistered', function () {
    console.log('device-unregistered');
});
