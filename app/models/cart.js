import Model, { attr } from '@ember-data/model';
import { hasMany } from 'ember-data/relationships';

export default class CartModel extends Model {
  @hasMany('hub-class') items
  @attr('string') firstName
  @attr('string') lastName
  @attr('string') email
  @attr('string') po
  @attr('string') companyName
  @attr('string') addressLine1
  @attr('string') addressLine2
  @attr('string') addressCity
  @attr('string') addressState
  @attr('string') addressZipcode

  @attr('date', { defaultValue: () => new Date() }) created
}
