var EventEmitter = require('events');
var util = require('util');

function generateNetworkId(publicIp, apiKey) {
    return apiKey + publicIp;
}

function Server (io) {

    EventEmitter.call(this);
    var Server = this;

    this.devices = {};

    io.on('connection', function (socket) {
        Server.use(socket);
    });

    this.devicesInNetwork = function (networkId) {
        var room = io.sockets.adapter.rooms[networkId];
        var devices = [];
        if (room !== undefined) {
            for (var socketId in room.sockets) {
                devices.push(Server.devices[socketId]);
            }
        }
        return devices;
    };

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
            if (device
                && device.name
                && device.apiKey
                && device.ip
                && device.id
                && device.name != ''
                && device.id != '') {
                    var ip = socket.handshake.address;
                    networkId = generateNetworkId(ip, device.apiKey);
                    var newDevice = {
                        networkId: networkId,
                        publicIp: ip,
                        privateIp: device.ip,
                        apiKey: device.apiKey,
                        id: device.id,
                        name: device.name
                    };
                    socket.join(networkId);
                    socket.broadcast.to(networkId).emit('device-joined', newDevice);
                    Server.devices[socket.id] = newDevice;
                    socket.emit('registered', newDevice);
                    isRegistered = true;
                    Server.emit('device-registered', newDevice);
            }
        });

        socket.on('discover', function (opts) {
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
