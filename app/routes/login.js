import Route from '@ember/routing/route';

export default Route.extend({
  resetController ( controller, isExiting ) {
    if ( isExiting ) {
      controller.set('expired', false);
    }
  },

  actions: {
    willTransition () {
      this.get('controller').set('previousTransition', null);
    }
  }
});
