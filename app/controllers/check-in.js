import Controller from '@ember/controller';
import ajaxStatus from 'safely/mixins/ajax-status';

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
