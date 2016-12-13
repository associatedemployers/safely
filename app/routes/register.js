import Ember from 'ember';
import authenticated from 'safely/mixins/authenticated';

const { Route, RSVP } = Ember;

export default Route.extend(authenticated, {
  model () {
    return RSVP.hash({
      classes: this.store.findAll('class')
    });
  },

  setupController (controller, model) {
    controller.setProperties({
      classes: model.classes
    });
  }
});
