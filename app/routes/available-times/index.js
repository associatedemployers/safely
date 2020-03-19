import Route from '@ember/routing/route';

export default Route.extend({
  model () {
    return this.store.query('available-time', {
      sort: {
        start: 1
      }
    });
  }
});
