import Controller from '@ember/controller';
import { action } from '@ember/object'; // HELPPP

export default class HubIndexController extends Controller {
  @action
  register () {
    this.transitionToRoute('/hub/register');
  }
}
