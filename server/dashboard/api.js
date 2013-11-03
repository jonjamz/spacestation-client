dashboard = (function () {

  // Private properties
  // ------------------
  var _config = {
    dashboardServer: 'http://localhost:3001',
    privateKey: '',
    ddpHandle: {}
  };

  // Private methods
  // ---------------
  function _setPrivateKey(key) {
    _config.privateKey = key;
    if (console != null && console.log != null)
      console.log "Key set to " + key;
  }

  function _connectToRemoteDashboard() {
    _config.ddpHandle = DDP.connect(_config.dashboardServer);
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