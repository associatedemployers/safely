import Model, { attr } from '@ember-data/model';

export default class HubInstructorModel extends Model {
  @attr('string') firstName
  @attr('string') lastName
  @attr('string') email
  @attr('number') phone
  @attr('string') location
  @attr('string') organization
  @attr('date', { defaultValue: () => new Date() }) created
}
