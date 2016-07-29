var Server = require('./server');
var Device = require('./device');

module.exports.server = function (io) {
    return new Server(io);
};
module.exports.device = new Device();
