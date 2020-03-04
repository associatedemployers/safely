import Model, { attr } from '@ember-data/model';

export default class HubInstructorModel extends Model {
  @attr('string') displayName
  @attr('string') email
  @attr('number') phone
  @attr('string') organization
  @attr('date', { defaultValue: () => new Date() }) created
}
