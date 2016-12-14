import Ember from 'ember';
import moment from 'moment';

const { Component, computed } = Ember;

export default Component.extend({
  tagName: 'li',
  classNames: [ 'cal__day' ],
  classNameBindings: [ 'day.outOfMonth:cal__gray' ],

  dayAvailabilities: computed('availability.[]', 'day.date', 'week', function () {
    let availabilities = this.get('availability'),
        date = moment(this.get('day.date'));

    if ( !availabilities ) {
      return [];
    }

    let weeks = availabilities[this.get('week')],
        day = weeks ? weeks[date.day()] : undefined;

    return day ? day.map(block => {
      let information = block[2];

      return {
        information,
        start: moment().hour(block[0]).format('ha'),
        end: moment().hour(block[1]).format('ha'),
        lowSeats: information && information.seats < 5,
        originalBlock: block
      };
    }) : [];
  })
});
