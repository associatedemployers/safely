import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class HubIndexController extends Controller {
  @service cart

  get tlWormholeTarget () {
    return document.querySelector('.ember-application');
  }

  @action
  register () {
    // this.transitionToRoute('/hub/register');
  }
}
