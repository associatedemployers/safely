import Model, { attr } from '@ember-data/model';

export default class HubBannerModel extends Model {
  @attr('string') heading
  @attr('string') body
  @attr('string') link
}
