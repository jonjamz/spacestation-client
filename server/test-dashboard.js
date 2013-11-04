Meteor.startup(function () {
  // Load dashboard
  SpaceStation.connect({
      authKey: '1234qwer',
      serverAddress: '127.0.0.1:3001'
  });
  Meteor.setInterval(function () {
    SpaceStation.push({message: 'hello'});
  }, 2000);
});