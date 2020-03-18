import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class HubAdministrationClassIndexController extends Controller {
  @action
  async deleteRegistration (reg) {
    if (!confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    await reg.destroyRecord();
  }
}
