import { computed } from '@ember/object';
import Controller, { inject as controller } from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  loginController: controller('login'),

  unauthorizedReason: computed('fromError', function () {
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
