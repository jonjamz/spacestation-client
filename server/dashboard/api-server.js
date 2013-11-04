dashboard = (function () {

  // Private properties
  // ------------------
  var _config = {
    dashboardServer: '127.0.0.1:3001',
    privateKey: '',
    ddpHandle: {},
  };

  //var _timers = {};

  // Private methods
  // ---------------
  function _setPrivateKey(key) {
    _config.privateKey = key;
    if (console != null && console.log != null)
      console.log("Key set to " + key);
  }

  function _connectToRemoteDashboard() {
    _config.ddpHandle = DDP.connect(_config.dashboardServer);
    if (console != null && console.log != null) {
      console.log("Connected to remote dashboard");
      console.log("DDP handle: " + JSON.stringify(_config.ddpHandle));
    }
  }

  function connect(key) {
    _setPrivateKey(key);
    _connectToRemoteDashboard();
  }


  // Developer-facing API
  // --------------------
  return {
    connect: connect
  }

}());