import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HubAdministrationRoute extends Route {
  @service auth
  authenticationChangeUrl = 'index'

  beforeModel (transition) {
    if (!this.get('auth.authenticated')) {
      this.controllerFor('login').set('previousTransition', transition);
      return this.transitionTo('login');
    }

    this.get('auth').addObserver('authenticated', this, this.__authenticationStateChanged);
  }

  __authenticationStateChanged () {
    if (this.get('auth.authenticated') === false) {
      this.transitionTo(this.get('authenticationChangeUrl'));
    }
  }

  willDestroy () {
    this.get('auth').removeObserver('authenticated', this, this.__authenticationStateChanged);
    this._super(...arguments);
  }
}
