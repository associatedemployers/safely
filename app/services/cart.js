import Service, { inject as service } from '@ember/service';
// import { A } from '@ember/array';

export default class CartService extends Service {
  @service store

  init () {
    console.log('f');
    this.fetchingCart = this.__getOrCreateCart();
    super.init(...arguments);
  }

  async __getOrCreateCart () {
    let cart = (await this.store.findAll('cart')).lastObject;
    console.log('hello?', cart, await this.store.findAll('cart'));
    if (!cart) {
      console.log('createm');
      cart = this.store.createRecord('cart');
    }

    this.state = cart;
    return cart;
  }


  async addItem (item) {
    await this.fetchingCart;
    console.log(this.state);
    this.state.items.addObject(item);
    await this.state.save();
    console.log('saved');
    return this.state;
  }
}
