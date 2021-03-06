var device = require('../src/nexus').device;

var opts = {
    //host: 'http://localhost:8080',
    host: 'https://nexus-io.herokuapp.com',
    // host: 'http://nexus-io.com',
    apiKey: 'abf21',
    id: '12fca'
};

device.register(opts);


device.on('registered', function (deviceInfo) {
    console.log('registered with apiKey: '+JSON.stringify(deviceInfo));

    device.detect();
});

device.on('unregistered', function () {
    console.log('unregistered');
});

device.on('devices', function (devices) {
    console.log(devices);
});

device.on('device-joined', function (newDevice) {
    console.log(newDevice);
});

device.on('device-leaved', function (oldDevice) {
    console.log(oldDevice);
})
