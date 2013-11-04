SpaceStation = (function () {



  // Core
  // ====



  var logCache = [],
      _config = {
        dashboardServer: '127.0.0.1:3001',
        privateKey: '',
        ddpHandle: {},
        connectRoutineStarted: false
      };

  function _setPrivateKey(key) {
    _config.privateKey = key;
    console.log("Key set to " + key);
  }

  function _startConnectRoutine() {
    if (!_config.connectRoutineStarted) {
      Deps.autorun(function () {
        if (_config.ddpHandle.status &&
          _config.ddpHandle.status().status) {

          // Print reactive connect logs to console
          console.log("remote dashboard: " +
            _config.ddpHandle.status().status);

          // On connect, send any cached logs
          if (_config.ddpHandle.status().status === 'connected') {
            var logCacheLength = logCache.length;
            if (!!logCacheLength) {
              console.log("Sending " + logCacheLength +
                " cached logs to remote dashboard");

              for (var i = logCacheLength - 1; i >= 0; i--) {
                _remoteLog(logCache[i]);
              };

              logCache.length = 0;
            }
          }
        }
      });
      _config.connectRoutineStarted = true;
    }
  }

  function _connectToRemoteDashboard() {
    _config.ddpHandle = DDP.connect(_config.dashboardServer);
    _startConnectRoutine();
  }

  function connect(key) {
    _setPrivateKey(key);
    _connectToRemoteDashboard();
  }

  function getConnectStatus() {
    if (_config.ddpHandle.status) {
      return _config.ddpHandle.status();
    }
  }

  // Log to remote server
  // Decorates logs with timestamp, caches if not connected
  function _remoteLog(data) {
    check(data, Object);
    data.timestamp = (new Date()).getTime();
    if (getConnectStatus().connected) {
      _config.ddpHandle.call('remoteLog', data);
    } else {
      logCache.push(data);
    }
  }

  function push(data, userId, userName, userEmail) {
    // Add user params to data if they exist
    data._user = {}
    if (userId != null) data._user._id = userId;
    if (userName != null) data._user.username = userName;
    if (userEmail != null) data._user.userEmail = userEmail;
    _remoteLog(data);
  }



  // Features
  // ========



  var timers = {};

  function time(name) {
    check(name, String);
    timers[name] = new Date();
  }

  function timeEnd(name) {
    check(timers, Match.Where(timers.hasOwnProperty(name)));
    var start = timers[name], end = new Date();
    return end.getTime() - start.getTime();
  }



  // Developer-facing API
  // ====================



  return {
    connect: connect,
    status: getConnectStatus, // Reactive!
    push: push,
    time: time,
    timeEnd: timeEnd
  }

}());