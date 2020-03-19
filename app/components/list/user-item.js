import Component from '@ember/component';

const UserItemComponent = Component.extend({
  tagName: 'tr',

  actions: {
    notify () {
      this.set('notified', true);
      this.get('onNotify')(this.get('user'));
    },

    resetUser () {
      if (!confirm('Are you sure you want to reset this user? This will remove their password and resend an activation email.')) {
        return;
      }

      this.get('onResetUser')(this.get('user'));
    }
  }
});

UserItemComponent.reopenClass({
  positionalParams: [ 'user' ]
});

export default UserItemComponent;
