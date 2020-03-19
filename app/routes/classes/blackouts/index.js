import Route from '@ember/routing/route';

export default Route.extend({
  model () {
    return this.store.query('blackout-date', {
      end: { $gte: new Date() },
      // 'classExceptions.0': { $exists: true },
      sort: {
        start: -1
      }
    });
  }
});
