import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default class HubRegistrationModel extends Model {
  @attr('string') firstName
  @attr('string') lastName
  @attr('string') email
  @attr('string') po
  @belongsTo('hub-class') hubClass
  @hasMany('hub-participant') participants

  @attr('string') companyName
  @attr('string') addressLine1
  @attr('string') addressLine2
  @attr('string') addressCity
  @attr('string') addressState
  @attr('string') addressZipcode

  @attr('number') total

  @attr('date', { defaultValue: () => new Date() }) created
}
