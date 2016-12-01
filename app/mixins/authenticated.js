import Ember from 'ember';

const { Mixin, inject } = Ember;

export default Mixin.create({
  auth: inject.service(),
  authenticationChangeUrl: 'index',

  beforeModel ( transition ) {
    if ( !this.get('auth.authenticated') ) {
      this.controllerFor('login').set('previousTransition', transition);
      return this.transitionTo('login');
    }

    this.get('auth').addObserver('authenticated', this, this.__authenticationStateChanged);
    this._super(...arguments);
  },

  __authenticationStateChanged () {
    if ( this.get('auth.authenticated') === false ) {
      this.transitionTo(this.get('authenticationChangeUrl'));
    }
  },

  willDestroy () {
    this.get('auth').removeObserver('authenticated', this, this.__authenticationStateChanged);
    this._super(...arguments);
  }
});
