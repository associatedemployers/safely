import Ember from 'ember';
import moment from 'moment';
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

  tzDiffers: computed(function () {
    return moment.tz.guess() !== 'America/Denver';
  }),

  hours: computed('selectedClasses.[]', function () {
    const classes = this.get('selectedClasses'),
          hours = classes ? classes.reduce((sum, i) => sum + i.get('hours'), 0) : 0;

    return hours % 2 ? Math.ceil(hours / 2) * 2 : hours;
  }),

  resetRegistrationForm () {
    this.set('selectedClasses', A());
    Ember.$('#reg-comments').val('');
    this.set('company', null);
  },

  actions: {
    register (selectedTime) {
      if ( this.get('working')) {
        return;
      }
      this.ajaxStart();

      const registrants = A(this.get('registrants')),
            classes = this.get('selectedClasses'),
            comments = this.get('comments');

      let registeredRegistrant = registration => {
        let regs = this.get('registrants');
        regs.removeObject(regs.findBy('id', registration.get('trainee.id')));
      };

      registrants.reduce((promise, registrant) => {
        let registration = this.store.createRecord('registration', {
          classes,
          comments,
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
        Ember.$(window).scrollTop(0);
      })
      .catch(this.ajaxError.bind(this));
    }
  }
});
