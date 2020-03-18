import Route from '@ember/routing/route';
import { A } from '@ember/array';
import { action } from '@ember/object';

export default class HubAdministrationClassEditRoute extends Route {
  async model ({ id }) {
    return {
      hubClass:        await this.store.find('hub-class', id),
      classes:         await this.store.query('hub-class-information', { sort: { name: 1 } }),
      instructors:     await this.store.query('hub-instructor', { sort: { displayName: 1 } }),
      recentLocations: (await this.store.query('hub-class', {
        sort:  { created: -1 },
        limit: 20
      })).toArray().reduce((locations, hubClass) => {
        if (!locations.find(l => l.locationName === hubClass.locationName && l.locationAddressLine1 === hubClass.locationAddressLine1)) {
          locations.addObject({
            id:                        hubClass.id,
            locationName:              hubClass.locationName,
            locationAddressLine1:      hubClass.locationAddressLine1,
            locationAddressLine2:      hubClass.locationAddressLine2,
            locationAddressCity:       hubClass.locationAddressCity,
            locationAddressState:      hubClass.locationAddressState,
            locationAddressZipcode:    hubClass.locationAddressZipcode,
            locationAddressDirections: hubClass.locationAddressDirections
          });
        }

        return locations;
      }, A())
    };
  }

  setupController (controller, model) {
    controller.setProperties({
      model:           model.hubClass,
      classes:         model.classes,
      instructors:     model.instructors,
      recentLocations: model.recentLocations
    });
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
