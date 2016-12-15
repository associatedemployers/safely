import Ember from 'ember';
import authenticated from 'safely/mixins/authenticated';

const { Route, RSVP, inject: { service } } = Ember;

export default Route.extend(authenticated, {
  auth: service(),

  model () {
    let hash = {
      classes: this.store.findAll('class')
    };

    if ( this.get('auth.user.administrative') ) {
      hash.companies = this.store.findAll('company');
    }

    return RSVP.hash(hash);
  },

  setupController (controller, model) {
    controller.setProperties({
      classes: model.classes,
      companies: model.companies
    });
  }
});
