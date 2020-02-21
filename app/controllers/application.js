import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class HubController extends Controller {
  @service router

  get onClassHub (){
    return this.get('router.currentRouteName').indexOf('hub') > -1;
  }
}
