import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  loginController: Ember.inject.controller('login'),

  unauthorizedReason: Ember.computed('fromError', function () {
    var error = this.get('fromError');

    if ( !error ) {
      return 'Undefined Error.';
    }

    var sessionExpires = this.session.get('content.expires');

    if ( moment(sessionExpires).isBefore(moment()) ) {
      this.get('loginController').set('fromError', 'Your session has expired. Please log in again.');
      this.transitionToRoute('login');
      return 'Your session has expired.';
    }

    return error.responseText ? 'The server says: ' + error.responseText : 'The server says: ' + error.statusText;
  })
});
