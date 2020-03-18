import Route from '@ember/routing/route';

export default class HubAdministrationInstructorsRoute extends Route {
  model () {
    return this.store.query('hub-instructor', {
      sort: {
        organization: 1,
        displayName:  1
      }
    });
  }
}
