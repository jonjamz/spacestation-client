Meteor.startup(function () {
  // Load dashboard
  SpaceStation.connect({
      authKey: '1234qwer'
  });
  Meteor.setInterval(function () {
    SpaceStation.push({message: 'hello'});
  }, 2000);
});