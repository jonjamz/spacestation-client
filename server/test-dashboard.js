Meteor.startup(function () {
  // Load dashboard
  SpaceStation.connect('1234qwer');
  Meteor.setInterval(function () {
    SpaceStation.push({message: 'hello'});
  }, 2000);
});