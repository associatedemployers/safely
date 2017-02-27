import Ember from 'ember';

const { Route, inject: { service } } = Ember;

export default Route.extend({
  ajax: service(),

  model (params) {
    return this.get('ajax').request(`/api/v1/user/${params.id}/activation-status`)
    .then(response => {
      if (response.activated) {
        return this.transitionTo('login');
      }

      return response;
    });
  }
});
