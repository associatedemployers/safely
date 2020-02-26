import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class RegisterRoute extends Route {
  @service cart

  async model () {
    return (await (this.cart.state || this.cart.fetchingCart)).items;
  }
}
