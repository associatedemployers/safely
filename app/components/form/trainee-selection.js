import Ember from 'ember';
import addEdit from 'safely/mixins/controller-abstractions/add-edit';

const { Component, A, on, run, computed, inject: { service } } = Ember;

export default Component.extend(addEdit, {
  store: service(),
  classNames: [ 'container', 'container__text' ],
  lookupKey: 'ssn',
  enableNotify: false,
  transitionAfterSave: false,
  selection: A(),
  showSsn: true,

  didUpdateAttrs () {
    this._super(...arguments);

    const selection = this.get('selected');

    if ( selection ) {
      let a = A();
      a.addObjects(selection);
      this.set('selection', a);
    }
  },

  disabled: computed.or('working', 'lookupIsShort'),
  noRecordFound: computed.and('lookedUp', 'noRecord'),
  noRecord: computed.not('result'),

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
      lookup: null
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
    }
  }
});
