import Model/*, { attr }*/ from '@ember-data/model';
import { hasMany } from 'ember-data/relationships';

export default class CartModel extends Model {
  @hasMany('hub-class') items
}
