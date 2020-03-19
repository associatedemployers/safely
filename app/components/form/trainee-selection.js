import { or, and, not } from '@ember/object/computed';
import Component from '@ember/component';
import { A } from '@ember/array';
import { on } from '@ember/object/evented';
import { run } from '@ember/runloop';
import { observer, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import addEdit from 'safely/mixins/controller-abstractions/add-edit';

export default Component.extend(addEdit, {
  store: service(),
  classNames: [ 'container', 'container__text' ],
  lookupKey: 'ssn',
  enableNotify: false,
  transitionAfterSave: false,
  showSsn: true,
  preventDualAction: true,

  _selection: A(),

  selection: computed('selected', {
    get() {
      return this.get('selected');
    },
    set() {
      return null;
    }
  }),

  updateSelection: observer('selected', function () {
    let a = A();
    a.addObjects(this.get('selected'));
    this.set('_selection', a);
  }),

  disabled: or('working', 'lookupIsShort'),
  noRecordFound: and('lookedUp', 'noRecord'),
  noRecord: not('result'),

  lookupIsShort: computed('lookup', function () {
    return !this.get('lookup') || this.get('lookup.length') < 2;
  }),

  ssnInputType: computed('showSsn', function () {
    return this.get('showSsn') ? 'text' : 'password';
  }),

  resetBlankRegistrant: on('didInsertElement', function(){
    this.set('registrant', this.get('store').createRecord('trainee'));
  }),

  afterSave (record) {
    this.get('selection').addObject(record);
    this.updateEvent();
    this.resetBlankRegistrant();
    this.setProperties({
      showNewForm: false,
      lookedUp: false,
      lookup: null,
      addingEmail: null
    });
  },

  updateEvent () {
    this.get('onChange')(this.get('selection'));
  },

  focusNewText () {
    run.scheduleOnce('afterRender', () => {
      this.$('.trainee-selection__create-button').focus();
    });
  },

  actions: {
    lookupRecord (lookup, lookupKey) {
      if ( this.get('working') ) {
        return;
      }

      this.ajaxStart();
      this.setProperties({
        lookedUp: false,
        showNewForm: false
      });

      let _lookup = '' + lookup;

      if ( lookupKey === 'ssn' ) {
        _lookup = _lookup.replace(/-/g, '').replace(/(\d{3})(\d{2})(\d{4}).*/, '$1-$2-$3');
      }

      let q = {
        limit: 1
      };

      q[lookupKey] = _lookup;

      this.get('store').query('trainee', q)
      .then(results => {
        let result = results ? results.get('firstObject') : undefined;
        this.ajaxSuccess();
        this.setProperties({
          result,
          lookedUp: true
        });

        if ( result ) {
          this.get('selection').addObject(result);
          this.set('lookup', null);
          this.updateEvent();
        } else if ( lookupKey === 'ssn' ) {
          this.set('registrant.ssn', _lookup);
        }

        if ( !result ) {
          this.focusNewText();
        }
      })
      .catch(this.ajaxError.bind(this));
    },

    showNewForm () {
      this.set('showNewForm', true);
      run.scheduleOnce('afterRender', () => {
        this.$('#registrant-name-first').focus();
      });
    },

    removeFromSelection (trainee) {
      this.get('selection').removeObject(trainee);
      this.updateEvent();
    },

    addEmail (registrant) {
      this.set('addingEmail', registrant.get('id'));
    }
  }
});
