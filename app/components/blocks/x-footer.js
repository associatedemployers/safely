import { inject as service } from '@ember/service';
import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  tagName: 'footer',
  classNames: [ 'footer' ],
  auth: service(),
  year: moment().format('YYYY'),

  actions: {
    logout () {
      this.get('logout')();
    }
  }
});
