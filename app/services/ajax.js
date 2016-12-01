import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';

const { inject, computed } = Ember;

export default AjaxService.extend({
  auth: inject.service(),

  headers: computed('auth.token', 'auth.authenticated', {
    get() {
      let headers = {};
      const token = this.get('auth.token');

      if ( this.get('auth.authenticated') ) {
        headers['X-API-Token'] = token;
      }

      return headers;
    }
  })
});
