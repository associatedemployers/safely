import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class HubAdministrationBannersIndexController extends Controller {
  @action
  async deleteBanner (banner) {
    await banner.destroyRecord();
  }
}
