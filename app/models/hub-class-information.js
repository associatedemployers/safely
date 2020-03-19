import Model, { attr } from '@ember-data/model';

export default class HubClassInformationModel extends Model {
  @attr('string') description
  @attr('string') name
  @attr('string') code
}
