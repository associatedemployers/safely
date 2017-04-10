import Ember from 'ember';

const { Component } = Ember;

const UserItemComponent = Component.extend({
  tagName: 'tr',

  actions: {
    notify () {
      this.set('notified', true);
      this.get('onNotify')(this.get('user'));
    }
  }
});

UserItemComponent.reopenClass({
  positionalParams: [ 'user' ]
});

export default UserItemComponent;
