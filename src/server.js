var EventEmitter = require('events');
var util = require('util');

function generateNetworkId(publicIp, apiKey) {
    return apiKey + publicIp;
}

function Server (io) {

    EventEmitter.call(this);
    var Server = this;

    this.devices = {};

    this.devicesInNetwork = function (networkId) {
        var room = io.sockets.adapter.rooms[networkId];
        var devices = [];
        if (room !== undefined) {
            for (var socketId in room.sockets) {
                devices.push(Server.devices[socketId]);
            }
        }
        return devices;
    }

    io.on('connection', function (socket) {
        Server.use(socket);
    });

    this.use = function (socket) {
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
            networkId = '';
            Server.emit('device-unregistered');
        });

        socket.on('register', function (device) {
            console.log('register');
            var ip = socket.handshake.address;
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

        socket.on('discover', function (opts) {
            console.log('discover '+isRegistered);
            //console.log(opts && opts.apiKey == true);
            if (isRegistered) {
                socket.emit('devices', Server.devicesInNetwork(networkId));
            } else if (opts && opts.apiKey){
                var ip = socket.handshake.address;
                var networkIdTmp = generateNetworkId(ip, opts.apiKey);
                socket.emit('devices', Server.devicesInNetwork(networkIdTmp));
            }
        });
    };
}

util.inherits(Server, EventEmitter);

module.exports = Server;
