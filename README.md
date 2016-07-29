# nexus.io

**nexus.io** is a very easy-to-use system based on websockets to register and detect computers and embedded boards on local networks. With **nexus.io**, all your devices register themself to a server, then any device can request to the server to find the devices available on the same local network.

In order to choose which devices are in the same network, the server uses the public ip address and to have a real time vision of available devices, we use websockets.

## Installing

    npm install nexus.io --save

## Device

### Registration and detection

Instantiate a `nexus.io device` in order to reference your app online and make it discoverable by other devices on the same network.

    var device = require('nexus.io').device;

    device.register({
        host: 'http://localhost:8080', // default is http://nexus.io
        apiKey: 'azXf21', // default is random
        name: 'name', // default is random
    });

    device.on('registered', function () {
        // registered
    });

    device.on('unregistered', function () {
        // unregistered
    });

    // after a device.detect(), a event "devices" is triggered and
    // send all devices currently connected to the local network
    device.on('devices', function (devices) {
        //
    });

    device.on('device-joined', function (newDevice) {
        // real-time event when an other device is detected
    });

    device.on('device-leaved', function (oldDevice) {
        // real-time event when an other device is detected
    });

### Detection without registration

    var device = require('nexus.io').device;

    device.detect({ apiKey: 'azXf21' }); // give the apiKey

    device.on('devices', function (devices) {
        //
    });


## Server

The server references devices. You may use the default server http://socket.io or start your own server.

To start your own server, you can use a standalone server by using the repository [nexus-server](https://github.com/ThibaultFriedrich/nexus-server).

You also may integrate the server in your app with the module `nexus.io`.

    var io = require('socket.io')();
    var server = require('nexus.io').server(io);

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
