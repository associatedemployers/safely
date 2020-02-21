import Model, { attr } from '@ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default class HubParticipantModel extends Model {
  @attr('string') firstName
  @attr('string') lastName
  @attr('string') phone
  @attr('string') email
  @belongsTo('company') company
  @belongsTo('hub-registration') registrations
  @attr('date', { defaultValue: () => new Date() }) created
}
