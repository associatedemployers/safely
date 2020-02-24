import { A } from '@ember/array';
import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';
import Ember from 'ember';

const {
  Logger
} = Ember;

function searchError ( errors ) {
  const detailKeys = A(['detail', 'message', 'title', 'status']),
        key = detailKeys.find(k => errors[0][k]);

  return key ? errors.mapBy(key).join(', ') : errors[0];
}

export default Mixin.create({
  successMessageTimeout: 3,
  enableNotify: true,

  ajaxError ( err, user ) {
    let errMsg = (err || {}).payload || (err || {}).responseText || err;

    if ( errMsg && errMsg.errors ) {
      errMsg = typeof errMsg.errors[0] === 'string' ? errMsg.errors : searchError(errMsg.errors);
    }

    if ( err && !user ) {
      Logger.error(err.stack || err);
    }

    this.setProperties({
      working:      false,
      errorMessage: errMsg
    });

    if ( this.get('enableNotify') ) {
      this.send('notify', 'error', 'Whoops! ' + errMsg);
    }
  },

  ajaxSuccess ( success, silent ) {
    this.setProperties({
      working:        false,
      errorMessage:   null,
      successMessage: success
    });

    run.later(() => {
      if ( !this.get('isDestroyed') && !this.get('isDestroying') ) {
        this.set('successMessage', null);
      }
    }, this.get('successMessageTimeout') * 1000);

    if ( !silent && this.get('enableNotify') ) {
      this.send('notify', 'success', success || 'Successfully saved.');
    }
  },

  ajaxStart () {
    this.setProperties({
      working:        true,
      errorMessage:   null,
      successMessage: null
    });
  }
});
