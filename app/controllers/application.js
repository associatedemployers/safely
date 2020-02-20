import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/computed';

export default Controller.extend({
  router: service(),
  
  onClassHub: computed('router.currentRouteName', function () {
    return this.get('router.currentRouteName').indexOf('hub') > -1;
  })
});
