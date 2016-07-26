var device = require('../index').device;

var opts = {
    host: 'http://localhost:8080',
    apiKey: 'azXf21'
};

device.register(opts);


device.on('registered', function () {
    console.log('registered with apiKey: '+device.apiKey);

    device.detect(function (err, devices) {
        if (err) {
            console.log(err);
        } else {
            console.log(devices);
        }

    });
});

device.on('unregistered', function () {
    console.log('unregistered');
});
