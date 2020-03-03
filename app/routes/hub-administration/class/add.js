import Route from '@ember/routing/route';

export default class HubAdministrationClassAddRoute extends Route {
  model () {
    return this.store.createRecord('hub-class');
  }
}
