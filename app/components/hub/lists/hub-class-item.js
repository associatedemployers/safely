import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class HubListsHubClassItemComponent extends Component {
  @service cart

  @action
  async register () {
    if (this.args.inCart) {
      await this.cart.removeItem(this.args.model);
    } else {
      await this.cart.addItem(this.args.model);
    }

    this.args.onRegister();
  }
}
