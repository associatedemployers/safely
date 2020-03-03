import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HubRegisterIndexRoute extends Route {
  @service cart

  async model () {
    const cart = await (this.cart.state || this.cart.fetchingCart);

    return {
      cart:         cart.items,
      cartRecord:   cart,
      registration: this.store.createRecord('hub-registration')
    };
  }
}
