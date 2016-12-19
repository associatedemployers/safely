import Ember from 'ember';
import moment from 'moment';

const { Component, A, computed, on, inject: { service } } = Ember;

function getWeekNums (momentObj) {
  var clonedMoment = moment(momentObj),
      first = clonedMoment.startOf('month').week(),
      last = clonedMoment.endOf('month').week();

  // In case last week is in next year
  if ( first > last) {
    last = first + last;
  }

  return last - first + 1;
}

export default Component.extend({
  classNames: [ 'cal__component' ],
  month: undefined,
  year: undefined,
  ajax: service(),

  setMonthYear: on('init', function () {
    if ( this.get('month') || this.get('year') ) {
      return;
    }

    var now = moment();

    this.setProperties({
      month: now.format('MMMM'),
      year: now.format('YYYY')
    });
  }),

  setAvailability: on('init', function () {
    let currentMonthSelected = moment(this.get('_momentComputed'));
    return this.get('ajax').request('/api/v1/availability', {
      data: {
        month: currentMonthSelected.month() + 1,
        year: currentMonthSelected.year()
      }
    })
    .then(res => {
      this.set('availability', res.availability);
      this.get('flattenedAvailabilities');
    });
  }),

  dayLabels: computed(function () {
    let labels = [];

    for (let i = 0; i < 7; i++) {
      labels.push(moment().day(i).format('dddd'));
    }

    return labels; // [ 'Sunday', 'Monday' ... 'Saturday' ]
  }),

  _momentComputed: computed('month', 'year', function () {
    var month = this.get('month'),
        year = parseFloat(this.get('year'));

    return month && year ? moment().year(year).month(month) : undefined;
  }),

  _weeks: computed('_momentComputed', 'requests.@each.date', function () {
    var mc = this.get('_momentComputed');

    if ( !mc ) {
      return undefined;
    }

    var startFrom = moment(mc).startOf('month'),
        weeks = Ember.A();//,
        // requests = this.get('requests');

    for ( var i = 0; i < getWeekNums(startFrom); i++ ) {
      let m = moment(startFrom).add(i, 'week');

      weeks.pushObject({
        range: {
          start: moment(m).startOf('week').toDate(),
          end: moment(m).endOf('week').toDate()
        }
      });
    }

    let setDaysForWeek = week => {
      week.days = [];

      for ( var d = 0; d < 7; d++ ) {
        var day = {
          date: moment(week.range.start).add(d, 'days').toDate()
        };

        day.outOfMonth = !moment(day.date).isSame(startFrom, 'month');
        // day.requests = requestsForDay(day);
        week.days.push(day);
      }

      return week;
    };

    return weeks.map(setDaysForWeek);
  }),

  nextMonth: computed('_momentComputed', function () {
    var m = this.get('_momentComputed');
    return m ? moment(m).add(1, 'month').format('MMMM') : undefined;
  }),

  lastMonth: computed('_momentComputed', function () {
    var m = this.get('_momentComputed');
    return m ? moment(m).subtract(1, 'month').format('MMMM') : undefined;
  }),

  flattenedAvailabilities: computed('availability', function () {
    let a = A(),
        weeks = this.get('_weeks');

    this.get('availability').forEach((week, weekIndex) => week.forEach((day, dayIndex) => day.forEach(block => {
      a.pushObject({
        block,
        date: moment(weeks[weekIndex].days[dayIndex].date).format('M/D/YY')
      });
    })));

    return a;
  }),

  updateActiveBlocks (startBlock) {
    this.setProperties({
      unsuitableBlock: null,
      registerWarning: null
    });

    let availability = this.get('flattenedAvailabilities'),
        hours = this.get('hours'),
        numberRegistering = this.get('registrants.length') || 0,
        activeBlocks = A([]);

    let block = availability.find(a => {
      return a.date === startBlock.date && a.block[0] === startBlock.block[0] && a.block[1] === startBlock.block[1];
    });

    let unsuitable = () => {
      this.setProperties({
        activeBlocks: A(),
        unsuitableBlock: true
      });
    };

    for (let i = availability.indexOf(block); activeBlocks.get('length') < hours / 2; i++) {
      let nextAvailability = availability.objectAt(i);

      if ( !nextAvailability ) {
        return unsuitable();
      }

      let information = nextAvailability.block ? nextAvailability.block[2] : false;

      if ( !information || information.seats < 1 ) {
        return unsuitable();
      }

      if ( information && information.seats < numberRegistering ) {
        this.set('registerWarning', `Only ${information.seats} will be able to register for this time block.`);
      }

      activeBlocks.addObject(nextAvailability);
    }

    this.setProperties({
      activeBlocks
    });
  },

  actions: {
    changeMonth ( month ) {
      var m = this.get('month'),
          year = parseFloat(this.get('year'));

      if ( month === 'January' && m === 'December' ) {
        year += 1;
      } else if ( month === 'December' && m === 'January' ) {
        year -= 1;
      }

      this.setProperties({ month, year });
      this.setAvailability();
    },

    focusBlock (block, date) {
      this.updateActiveBlocks({
        block,
        date: moment(date).format('M/D/YY')
      });
    },

    unfocusBlock () {
      this.set('activeBlocks', A());
    }
  }
});
