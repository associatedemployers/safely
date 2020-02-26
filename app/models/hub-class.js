import Model, { attr } from '@ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default class HubClassModel extends Model {
  @attr('string') organization
  @belongsTo('hub-instructor') instructor
  @belongsTo('hub-class-information') classInformation
  @attr('string') locationName
  @attr('string') locationAddressLine1
  @attr('string') locationAddressLine2
  @attr('string') locationAddressCity
  @attr('string') locationAddressState
  @attr('string') locationAddressZipcode
  @attr('string') locationAddressDirections
  @attr('number') memberPrice
  @attr('number') nonMemberPrice
  @attr('number') memberAddParticipantsPrice
  @attr('number') nonMemberAddParticipantsPrice
  @attr('string') geoLat
  @attr('string') geoLng
  @attr('array')  times
  @attr('number') seats
  @attr('number') seatsRemaining
  @attr('number') totalParticipants
  @attr('date', { defaultValue: () => new Date() }) created

  get isFull () {
    return !this.seatsRemaining;
  }
}
