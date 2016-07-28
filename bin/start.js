var server = require('../src/nexus').server;

var opts = {
    port: process.env.PORT || 8080
};

server.start(opts);

server.on('started', function () {
    console.log('listening');
});

server.on('device-registered', function (device) {
    console.log('device-registered');
    console.log(device);
});

server.on('device-unregistered', function () {
    console.log('device-unregistered');
});
