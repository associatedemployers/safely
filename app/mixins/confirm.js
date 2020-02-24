import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';
import { set } from '@ember/object';

export default Mixin.create({
  // Public APIs
  confirm ( message, title = 'Confirm', stateKey = 'confirmState' ) {
    return this.__setupState('Confirm', message, title, stateKey);
  },

  alert ( message, title = 'Alert', stateKey = 'confirmState' ) {
    return this.__setupState('Alert', message, title, stateKey);
  },

  __setupState ( type, message, title, stateKey ) {
    return new RSVP.Promise(resolve => {
      set(this, stateKey, {
        type,
        message,
        title,
        resolver: resolve
      });
    }).then(this.__teardownState(stateKey).bind(this));
  },

  __teardownState ( stateKey ) {
    return response => {
      set(this, stateKey, undefined);
      return response;
    };
  }
});
