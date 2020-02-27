import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HubRegisterIndexRoute extends Route {
  @service cart

  async model () {
    return {
      cart:         (await (this.cart.state || this.cart.fetchingCart)).items,
      registration: this.store.createRecord('hub-registration')
    };
  }
}
