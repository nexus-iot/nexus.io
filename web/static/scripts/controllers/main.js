app.controller('MainCtrl', function($scope, socket, $timeout){
    $scope.devices = [];
    socket.on('devices', function (devices) {
        $scope.devices = devices;
        if ($scope.devices.length >0) {
            $scope.device.publicIp = $scope.devices[0].publicIp;
            $timeout.cancel($scope.delay);
        } else {
            $scope.detectionDone = true;
        }

        console.log(devices);
    })

    $scope.detectionDone = false;

    $scope.device = {
        apiKey: '',
        publicIp: ''
    };

    $scope.discover = function () {
        console.log($scope.device.apiKey);
        $scope.detectionDone = false;
        socket.emit('discover', {apiKey:$scope.device.apiKey});

        $scope.delay = $timeout(function () {
            $scope.detectionDone = true;
        }, 5000);
    };

    $scope.template = 'partials/main.html';

});
