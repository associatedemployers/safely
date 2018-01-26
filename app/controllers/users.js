import Ember from 'ember';
import addEdit from '../mixins/controller-abstractions/add-edit';

const { Controller, inject: { service } } = Ember;

export default Controller.extend(addEdit, {
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
    },

    resetUser (user) {
      if (this.get('working') || !user) {
        return;
      }

      this.ajaxStart();

      user.setProperties({
        password: null,
        activatedOn: null
      });

      this.saveModel(user);
    }
  }
});
