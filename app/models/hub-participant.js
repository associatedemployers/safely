import Model, { attr } from '@ember-data/model';

export default class HubParticipantModel extends Model {
  @attr('string') firstName
  @attr('string') lastName
  @attr('string') email

  @attr('date', { defaultValue: () => new Date() }) created

  get name () {
    return [ this.firstName, this.lastName ].filter(Boolean).join(' ');
  }
}
