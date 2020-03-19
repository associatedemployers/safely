import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import authenticated from 'safely/mixins/authenticated';

export default Route.extend(authenticated, {
  auth: service(),

  model () {
    let hash = {
      classes: this.store.query('class',
      { sort: { name: 1 }})
    };

    if ( this.get('auth.user.administrative') ) {
      hash.companies = this.store.query('company',
      { sort: { name: 1 }});
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
