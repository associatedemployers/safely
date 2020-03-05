import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
// import { A } from '@ember/array';

export default class CartService extends Service {
  @service store
  @tracked state

  init () {
    this.fetchingCart = this.__getOrCreateCart();
    super.init(...arguments);
  }

  async __getOrCreateCart () {
    let cart = (await this.store.findAll('cart')).lastObject;

    if (!cart) {
      cart = this.store.createRecord('cart');
    }

    this.state = cart;
    return cart;
  }

  async addItem (item) {
    await this.fetchingCart;
    this.state.items.addObject(item);
    await this.state.save();
    return this.state;
  }

  async removeItem (item) {
    await this.fetchingCart;
    this.state.items.removeObject(item);
    await this.state.save();
    return this.state;
  }
}
