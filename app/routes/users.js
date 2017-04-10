import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model () {
    return this.store.query('user', {
      limit: 10000,
      sort: {
        name: -1
      }
    });
  }
});
