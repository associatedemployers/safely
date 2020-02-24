import Route from '@ember/routing/route';

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
