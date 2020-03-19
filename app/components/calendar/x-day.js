import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

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
      let information = block[2],
          startF = moment().hour(block[0]),
          endF = moment().hour(block[1]);

      return {
        startF,
        endF,
        information,
        start: startF.format('ha'),
        end: endF.format('ha'),
        lowSeats: information && information.seats < 5,
        originalBlock: block
      };
    }) : [];
  })
});
