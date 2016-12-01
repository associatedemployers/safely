import Ember from 'ember';
import ajaxStatus from 'safely/mixins/ajax-status';

const { Controller } = Ember;

export default Controller.extend(ajaxStatus, {
  traineeFixtures: [ 'Bob Ross', 'Dream Weaver', 'Willie Nelson', 'Janet Jackson' ],

  actions: {
    capture (uri) {
      this.set('cameraUri', uri);
    },

    captureError (err) {
      this.ajaxError(err);
    }
  }
});
