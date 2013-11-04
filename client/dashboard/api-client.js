SpaceStation = {
  push: function (type, message, data) {
    Meteor.call('SpaceStation__meteorAccounts__push', type, message, data);
  }
};