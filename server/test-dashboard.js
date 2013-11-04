Meteor.startup(function () {
  // Load dashboard
  SpaceStation.connect({
      authKey: '1234qwer'
  });
  Meteor.setInterval(function () {
    SpaceStation.push('test', 'hello', {
      animals: ['zebra', 'dog']
    });
  }, 2000);
});