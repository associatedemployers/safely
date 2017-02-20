import Ember from 'ember';
import add from 'safely/mixins/route-abstractions/add';

const { Route, RSVP: { hash } } = Ember;

export default Route.extend(add, {
  modelName: 'blackout-date',

  model () {
    return hash({
      blackout: this._super(...arguments),
      availableClasses: this.store.findAll('class')
    });
  },

  setupController (controller, model) {
    controller.setProperties({
      model: model.blackout,
      availableClasses: model.availableClasses
    });
  }
});
