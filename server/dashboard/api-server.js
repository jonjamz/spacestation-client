SpaceStation = (function () {



  // Core
  // ====



  var logCache = [],
      _config = {
        dashboardServer: '127.0.0.1:3001',
        privateKey: '',
        ddpHandle: {},
        connectLogsStarted: false
      };

  function _setPrivateKey(key) {
    _config.privateKey = key;
    console.log("Key set to " + key);
  }

    function _startConnectLogs() {
      if (!_config.connectLogsStarted) {
        Deps.autorun(function () {
          if (_config.ddpHandle.status &&
          _config.ddpHandle.status().status) {
            console.log("remote dashboard: " +
              _config.ddpHandle.status().status);
          }
        });
        _config.connectLogsStarted = true;
      }
    }

    function _connectToRemoteDashboard() {
      _config.ddpHandle = DDP.connect(_config.dashboardServer);

      // On reconnect, send any cached logs
      _config.ddpHandle.onReconnect = function() {
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

      // Print reactive connect logs to console
      _startConnectLogs();
    }

  function connect(params) {
    _setPrivateKey(params.authKey);
    _connectToRemoteDashboard();
  }

  function getConnectStatus() {
    if (_config.ddpHandle.status) {
      return _config.ddpHandle.status();
    }
  }

  // Log to remote server
  // Decorates logs with timestamp, caches if not connected
  function _remoteLog(obj) {
    if (getConnectStatus().connected) {
      _config.ddpHandle.call('remoteLog', _config.privateKey, obj);
    } else {
      logCache.push(obj);
    }
  }

  function push(type, message, data) {
    check(type, String);
    check(message, String);
    check(data, Match.Optional(Object));

    if (!data)
      data = {};

    if (!data._timestamp)
      data._timestamp = new Date();

    obj = {
      type: type,
      message: message,
      data: data
    };

    _remoteLog(obj);
  }

  // Meteor Accounts automatic user add
  Meteor.methods({
    SpaceStation__meteorAccounts__push: function (type, message, data) {

      if (!data) {
        data = {};
      }

      if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        data._user = {};
        data._user._id = this.userId;
        data._user.username = user.username;
        data._user.email = user.emails[0].address;
      }
      SpaceStation.push(type, message, data);
    },
    SpaceStation__meteorAccounts__query: function () {} // Figure it out!
  });



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