import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class HubAdministrationIndexController extends Controller {
  @action
  async deleteClass (cl) {
    if (!confirm('Are you sure you want to delete this class?')) {
      return;
    }

    await cl.destroyRecord();
  }
}
