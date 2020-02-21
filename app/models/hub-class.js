import Model, { attr } from '@ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default class HubClassModel extends Model {
  @attr('string') organization
  @belongsTo('hub-instructor') instructor
  @belongsTo('hub-class-information') classInformation
  @attr() location
  @attr('string') cost
  @attr('array') times
  @attr('string') seats
  @attr('date', { defaultValue: () => new Date() }) created
}
