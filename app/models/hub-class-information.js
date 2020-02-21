import Model, { attr } from '@ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default class HubClassInformationModel extends Model {
  @attr('string') description
  @attr('string') name
  @attr('string') code
  @belongsTo('hub-class') class
}