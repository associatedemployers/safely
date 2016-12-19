import Ember from 'ember';

const { Controller, A, computed } = Ember;

export default Controller.extend({
  queryParams: [ 'range', 'date', 'lookback' ],
  date: null,
  range: 'week',
  lookback: 0,
  ranges: [ 'day', 'week', 'month' ],

  defaultFormat: 'dddd, MMMM Do YYYY',

  rangeHumanized: computed('range', 'lookback', function () {
    let range = this.get('range'),
        lookback = this.get('lookback'),
        start = moment().add(lookback, range).startOf(range),
        end = moment().add(lookback, range).endOf(range),
        f = this.get('defaultFormat');

    return `${start.format(f)}${range === 'day' ? '' : ' - ' + end.format(f)}`;
  }),

  modelGroups: computed('model.[]', function () {
    const model = this.get('model'),
          lookback = this.get('lookback'),
          range = this.get('range'),
          days = A();

    if ( !model ) {
      return days;
    }

    let baseDate = moment().add(lookback, range),
        start = moment(baseDate).startOf(range),
        daysInRange = moment(baseDate).endOf(range).diff(start, 'days') + 1;

    for (let i = 0; i < daysInRange; i++) {
      let dayMoment = moment(start).add(i, 'days');

      let day = {
        date: dayMoment.toDate(),
        registrations: A()
      };

      day.registrations.addObjects(model.filter(regist => {
        let s = regist.get('start'),
            e = regist.get('end');

        return dayMoment.isSame(s, 'day') || dayMoment.isSame(e, 'day') || dayMoment.startOf('day').isAfter(s) && dayMoment.endOf('day').isBefore(e);
      }));

      if ( day.registrations.length > 0 ) {
        days.pushObject(day);
      }
    }

    return days;
  }),

  actions: {
    changeLookback (type) {
      this[`${type}Property`]('lookback');
    }
  }
});