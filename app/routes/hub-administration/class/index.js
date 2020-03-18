import Route from '@ember/routing/route';

export default class HubAdministrationClassIndexRoute extends Route {
  async model ({ id }) {
    return {
      hubClass:      await this.store.find('hub-class', id),
      registrations: await this.store.query('hub-registration', {
        hubClass: id,
        sort:     { created: -1 }
      })
    };
  }
}
