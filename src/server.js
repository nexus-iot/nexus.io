var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var EventEmitter = require('events');
var util = require('util');

app.get('/', function (req, res) {
    res.send('See how to use nexus.io on https://github.com/ThibaultFriedrich/nexus.io');
});

function Server () {

    EventEmitter.call(this);
    var Server = this;

    this.port = 80;
    this.devices = {};
    this.start = function (opts) {
        if (opts && opts.port) {
            this.port = opts.port;
        }

        server.listen(this.port, process.env.YOUR_HOST || '0.0.0.0', function () {
           Server.emit('started'); 
        });
    };

    /*
    app.get('/devices/:apiKey', function (req, res, next) {
        //var ip = req.headers['x-forwarded-for'] || 
        var ip = req.connection.remoteAddress;
        //req.socket.remoteAddress ||
        //req.connection.socket.remoteAddress;
        var apiKey = req.params.apiKey;
        var networkId = apiKey + ip;

        console.log(networkId);
        var room = io.sockets.adapter.rooms[networkId]; 
        var devices = [];
        if (room !== undefined) {
            for (var id in room.sockets) {
                devices.push(Server.devices[id]);
            }
        }
        res.send(devices);
    });*/

    this.displayDevices = function (networkId) {
        //console.log(io.sockets.adapter.rooms);
        console.log(networkId);
        var room = io.sockets.adapter.rooms[networkId]; 
        //console.log(room);
        if (room !== undefined) {
            for (var id in room.sockets) {
                console.log(Server.devices[id]);
            }
        } else {
            console.log({});
        }
    };

    io.on('connection', function (socket) {
        var isRegistered = false;
        var networkId = '';

        socket.on('disconnect', function () {
            if (!isRegistered) {
                return;
            }
            socket.leave(networkId);
            Server.devices[socket.id] = null;
            delete Server.devices[socket.id];
            isRegistered = false;
            Server.emit('device-unregistered');
            //Server.displayDevices(networkId);
        });

        socket.on('discover', function () {
            if (isRegistered) {
                console.log('discover');
                var room = io.sockets.adapter.rooms[networkId]; 
                var devices = [];
                if (room !== undefined) {
                    for (var id in room.sockets) {
                        devices.push(Server.devices[id]);
                    }
                }
                socket.emit('devices', devices);
            }
        });

        socket.on('register', function (device) {
            //var ip = socket.request.connection.remoteAddress;
            var ip = socket.handshake.address.address;
            //console.log(ip);
            networkId = device.apiKey + ip; 
            socket.join(networkId);
            Server.devices[socket.id] = {
                networkId: networkId,
                publicIp: ip, 
                privateIp: device.ip,
                apiKey: device.apiKey,
                name: device.name
            };
            socket.emit('registered', Server.devices[socket.id]);
            isRegistered = true;
            Server.emit('device-registered', Server.devices[socket.id]);
            //Server.displayDevices(networkId);
        });
    });
}

util.inherits(Server, EventEmitter);

module.exports = Server;

