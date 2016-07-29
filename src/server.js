var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var EventEmitter = require('events');
var util = require('util');
var swig = require('swig');


app
.engine('html', swig.renderFile)
.set('view cache', false)
.set('view engine', 'html')
.set('views', __dirname+'/../web/views/templates')
.get('/', function (req, res) {
    res.render('index.html', {title: 'Nexus'})
})
.get('/detect', function (req, res) {
    res.render('detect.html', {title: 'Detection'})
})
.use(express.static(__dirname+'/../web/static'))
.use('/partials', express.static(__dirname+'/../web/views/partials'));


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
            socket.broadcast.to(networkId).emit('device-leaved', Server.devices[socket.id]);
            Server.devices[socket.id] = null;
            delete Server.devices[socket.id];
            isRegistered = false;
            Server.emit('device-unregistered');
            //Server.displayDevices(networkId);
        });

        socket.on('discover', function (opts) {
            console.log('discover '+isRegistered);
            //console.log(opts && opts.apiKey == true);
            console.log(opts);
            if (isRegistered) {
                var room = io.sockets.adapter.rooms[networkId];
                var devices = [];
                if (room !== undefined) {
                    for (var id in room.sockets) {
                        devices.push(Server.devices[id]);
                    }
                }
                socket.emit('devices', devices);
            } else if (opts && opts.apiKey){
                var ip = socket.handshake.address;
                console.log(ip);
                console.log(opts.apiKey);

                var networkIdTmp = opts.apiKey + ip;
                var room = io.sockets.adapter.rooms[networkIdTmp];
                console.log(networkIdTmp);
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
            var ip = socket.handshake.address;
            //console.log(ip);
            networkId = device.apiKey + ip;
            var newDevice = {
                networkId: networkId,
                publicIp: ip,
                privateIp: device.ip,
                apiKey: device.apiKey,
                name: device.name
            };
            socket.join(networkId);
            socket.broadcast.to(networkId).emit('device-joined', newDevice);
            Server.devices[socket.id] = newDevice;
            socket.emit('registered', newDevice);
            isRegistered = true;
            Server.emit('device-registered', newDevice);
            //Server.displayDevices(networkId);
        });
    });
}

util.inherits(Server, EventEmitter);

module.exports = Server;
