import Route from '@ember/routing/route';

export default Route.extend({
  titleToken: 'Error',

  actions: {
    didTransition () {
      const controller = this.get('controller'),
            lf = window.localforage;

      if ( !controller.get('fromError') ) {
        return lf.getItem('graniteRoutePreviousToError').then(previousRoute => {
          return this.transitionTo(previousRoute || 'index');
        });
      }

      let previousRoute = controller.get('previousRoute');

      if ( previousRoute ) {
        lf.setItem('graniteRoutePreviousToError', previousRoute);
      }
    },

    willTransition () {
      window.localforage.setItem('graniteRoutePreviousToError', null);
    }
  }
});
