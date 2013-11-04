SpaceStation = {
  push: function (type, message, data) {
    Meteor.call('SpaceStation__push__meteorAccounts', type, message, data);
  }
};