import Ember from 'ember';
import ajaxStatus from 'safely/mixins/ajax-status';

const { Controller, inject: { service } } = Ember;

export default Controller.extend(ajaxStatus, {
  ajax: service(),

  actions: {
    activate () {
      this.ajaxStart();

      let password = this.get('password');

      this.get('ajax').post(`/api/v1/user/${this.get('model.id')}/activate/`, {
        data: {
          password
        }
      })
      .then(() => {
        this.ajaxSuccess('Successfully activated account. Please log in with your new password.');
        this.transitionToRoute('login');
      })
      .catch(this.ajaxError.bind(this));
    }
  }
});
