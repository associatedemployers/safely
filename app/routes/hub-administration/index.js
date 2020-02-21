import Route from '@ember/routing/route';

export default class HubAdministrationIndexRoute extends Route {
  model () {
    return this.store.query('hub-class', { sort: { 'times.0.start': -1 } });
  }
}
