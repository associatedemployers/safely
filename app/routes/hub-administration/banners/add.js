import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class HubAdministrationBannersAddRoute extends Route {
  model () {
    return this.store.createRecord('hub-banner');
  }

  @action
  willTransition (transition) {
    var model = this.controller.get('model');

    if (!model || !model.get('isNew')) {
      return true;
    }

    if (Object.keys(model.changedAttributes()).length > 0 && !confirm('Are you sure you want to abandon progress on this page?')) {
      transition.abort();
    } else {
      model.destroyRecord();
      return true;
    }
  }
}
