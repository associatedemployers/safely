import Ember from 'ember';

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
    console.log(`For the ${date.format('Do [of] MMM')}, getting day index: ${date.day()}, week index: ${this.get('week')}`);
    let weeks = availabilities[this.get('week')],
        day = weeks ? weeks[date.day()] : undefined;

    return day ? day.map(block => {
      let information = block[2];

      return {
        information,
        start: block[0],
        end: block[1],
        lowSeats: information && information.seats < 5
      };
    }) : [];
  })
});
