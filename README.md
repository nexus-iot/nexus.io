# nexus.io
discovery system of devices on local networks

## Server

A server instance references devices.


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

A device instance which wants to be referenced by a server

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

A device also may detected others devices on the same local network whatever the device is already registered or not.
    
    var device = require('nexus.io').device;

    device.detect(function (err, devices) {
        if (err) {
            // error
        } else {
            console.log(devices);
        }
    });
