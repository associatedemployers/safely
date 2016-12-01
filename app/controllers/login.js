import Ember from 'ember';
import ajaxStatus from 'safely/mixins/ajax-status';

const { Controller } = Ember;

export default Controller.extend(ajaxStatus, {
  queryParams: [ 'expired' ],
  expired: false,

  actions: {
    login () {
      const email = this.get('email'),
            password = this.get('password');

      this.ajaxStart();

      if ( !email || !password ) {
        return this.ajaxError('Please complete all fields before submitting.');
      }

      this.auth.login(email, password)
      .then(() => {
        let previousTransition = this.get('previousTransition');
        this.ajaxSuccess('Successfully logged in.');

        if ( previousTransition ) {
          previousTransition.retry();
        } else {
          this.transitionToRoute('account.index');
        }
      })
      .catch(this.ajaxError.bind(this));
    }
  }
});
