# nexus.io

**nexus.io** is a very easy-to-use system based on websockets to register and detect computers and embedded boards on local networks. With **nexus.io**, all your devices register themself to a server, then any device can request to the server to find the devices available on the same local network.

In order to choose which devices are in the same network, the server uses the public ip address and to have a real time vision of available devices, we use websockets.

## Installing

    npm install nexus.io --save

## Server

The server references devices. You may use the default server http://socket.io or start your own server.

You can use a standalone server by executing `npm start`. You also may integrate the server in your app with the module `socket.io`.

    var server = require('nexus.io').server;

    server.start();
    // or
    server.start({
        port: 8080, // optionnal
    });

    server.on('started', function () {
        // started
    });

    server.on('error', function (error) {
        // error
    });

    server.on('end', function () {
        // end
    });

    server.on('device-registered', function (device) {
        console.log('device-registered');
    });

    server.on('device-unregistered', function () {
        console.log('device-unregistered');
    });


## Device

### Registration

Instantiate a `nexus.io device` in order to reference your app online and make it available to other device on the same network.

    var device = require('nexus.io').device;

    device.register();
    // or
    device.register({
        host: 'http://localhost:8080',
        apiKey: 'azXf21',
        name: 'name', // try to use a unique name on the local network
    });

    device.on('registered', function () {
        // registered
    });

    device.on('unregistered', function () {
        // unregistered
    });

### Detection

A device also may detect other devices on the same local network.


#### Detection after Registration

    var device = require('nexus.io').device;

    // register the device, then detect others devices
    device.register({
        host: 'http://localhost:8080',
        apiKey: 'azXf21',
        name: 'name', // try to use a unique name on the local network
    });

    device.on('registered', function () {
        device.detect();
    });

    // after a device.detect(), a event "devices" is triggered with all devices
    // detected in the local network
    device.on('devices', function (devices) {
        //
    });

    // real-time events
    device.on('device-joined', function (newDevice) {
        //
    });

    device.on('device-leaved', function (oldDevice) {

    });

#### Detection without registration

    var device = require('nexus.io').device;

    device.detect({ apiKey: 'azXf21' }); // give the apiKey

    device.on('devices', function (devices) {
        //
    });
