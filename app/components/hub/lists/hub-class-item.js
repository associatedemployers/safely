import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class HubListsHubClassItemComponent extends Component {
  @service cart

  @action
  async register () {
    this.args.addToCart(this.args.model);
  }
}
