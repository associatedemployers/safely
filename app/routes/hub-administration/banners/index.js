import Route from '@ember/routing/route';

export default class HubAdministrationBannersIndexRoute extends Route {
  model () {
    return this.store.findAll('hub-banner');
  }
}
