import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class HubAdministrationBannersEditController extends Controller {
  @service data

  colors = [
    'info',
    'primary',
    'success',
    'warning',
    'danger',
    'gray',
    'white',
    'black',
    'aeblue',
    'aegold',
    'msscgreen'
  ]

  @action
  async save () {
    await this.data.saveRecord(this.model, 'saveBanner', false, [ 'heading' ]);
    this.transitionToRoute('hub-administration.banners.index');
  }
}
