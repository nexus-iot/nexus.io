var EventEmitter = require('events');
var util = require('util');
var os = require('os');
var ifaces = os.networkInterfaces();
var http = require('http');
var client = require('socket.io-client');
var request = require('request');
var randomstring = require("randomstring");


function getIpAddress (arg) {
    if (arg) {
        for (var index in ifaces[arg]) {
            var iface = ifaces[ifname][index];
            if ('IPv4' == iface.family && iface.internal == false) {
               return iface.address; 
            }
        }
    } else {
        for (var ifname in ifaces) {
            for (var index in ifaces[ifname]) {
                var iface = ifaces[ifname][index];
                if ('IPv4' == iface.family && iface.internal == false) {
                   return iface.address; 
                }
            }
        }
    }
    throw new Error('not address found');
}

//console.log(ifaces);
//console.log(getIpAddress());

function Device () {
    EventEmitter.call(this);
    var Device = this;

    this.socket = null;
    this.host = 'http://nexus.io';
    this.iface = undefined;
    this.apiKey = randomstring.generate(7);
    this.name = randomstring.generate(4);

    this.register = function (opts) {
        if (opts && opts.host) {
            this.host = opts.host;
        }
        
        if (opts && opts.apiKey) {
            this.apiKey = opts.apiKey;
        }

        if (opts && opts.iface) {
            this.iface = opts.iface;
        }
        
        if (opts && opts.name) {
            this.name = opts.name;
        }

        this.socket = client(Device.host);

        this.socket.on('connect', function () {
            Device.socket.emit('register', {
                ip: getIpAddress(Device.iface),
                apiKey: Device.apiKey,
                name: Device.name
            });
        });
        this.socket.on('registered', function (device) {
            Device.emit('registered', device);
        });
        this.socket.on('disconnect', function () {
            Device.emit('unregistered');
        });

        this.socket.on('devices', function (devices) {
            Device.emit('devices', devices);
        });
    };

    this.unregister = function () {
        Device.socket.disconnect();
    };

    this.detect = function (callback) {
        Device.socket.emit('discover');
   };
}

util.inherits(Device, EventEmitter);
module.exports = Device;

