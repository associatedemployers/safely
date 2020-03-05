import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class HubIndexController extends Controller {
  @service cart

  @action
  register () {
    // this.transitionToRoute('/hub/register');
  }
}
