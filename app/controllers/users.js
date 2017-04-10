import Ember from 'ember';
import ajaxStatus from '../mixins/ajax-status';

const { Controller, inject: { service } } = Ember;

export default Controller.extend(ajaxStatus, {
  ajax: service(),

  actions: {
    notifyUser (user) {
      if (this.get('working') || !user) {
        return;
      }

      this.ajaxStart();

      this.get('ajax').post(`/api/v1/user/${user.get('id')}/send-activation-email`)
      .then(() => {
        this.ajaxSuccess(`Sent user activation email to ${user.get('email')}`);
      })
      .catch(this.ajaxError.bind(this));
    }
  }
});
