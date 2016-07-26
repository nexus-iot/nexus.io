var server = require('../index').server;

var opts = {
    port: 80
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
