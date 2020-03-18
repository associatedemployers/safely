import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class HubAdministrationInstructorsController extends Controller {
  @action
  async deleteInstructor (model) {
    if (!confirm('Are you sure you want to delete this instructor?')) {
      return;
    }

    await model.destroyRecord();
  }
}
