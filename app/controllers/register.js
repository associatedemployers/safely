import Ember from 'ember';
import ajaxStatus from 'safely/mixins/ajax-status';

const { Controller, RSVP, A, computed, inject: { service } } = Ember;

export default Controller.extend(ajaxStatus, {
  auth: service(),
  registrants: A(),
  selectedClasses: A(),

  init () {
    this._super(...arguments);
    this.set('company', this.get('auth.user.company'));
  },

  hours: computed('selectedClasses.[]', function () {
    const classes = this.get('selectedClasses');
    return classes ? classes.reduce((sum, i) => sum + i.get('hours'), 0) : 0;
  }),

  resetRegistrationForm () {
    this.set('selectedClasses', A());
  },

  actions: {
    register (selectedTime) {
      this.ajaxStart();

      const registrants = A(this.get('registrants')),
            classes = this.get('selectedClasses');

      let registeredRegistrant = registration => {
        let regs = this.get('registrants');
        regs.removeObject(regs.findBy('id', registration.get('trainee.id')));
      };

      registrants.reduce((promise, registrant) => {
        let registration = this.store.createRecord('registration', {
          classes,
          trainee: registrant,
          start: selectedTime,
          company: this.get('company') || this.get('auth.user.company')
        });

        return promise.then(() => registration.save())
        .then(registeredRegistrant)
        .catch(err => {
          if ( err.status > 499 ) {
            return;
          } else {
            throw err;
          }
        });
      }, RSVP.resolve()).then(() => {
        this.resetRegistrationForm();
        this.ajaxSuccess();
      })
      .catch(this.ajaxError.bind(this));
    }
  }
});
