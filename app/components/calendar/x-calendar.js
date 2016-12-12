import Ember from 'ember';

const { Component, computed, run, on } = Ember;

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
  ajax: Ember.inject.service(),

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

    // let requestsForDay = day => {
    //   return requests.filter(request => {
    //     let rejected = !request.get('approved') && request.get('reviewedOn');
    //     return rejected ? false : request.get('days').find(d => {
    //       return moment(d.date).isSame(day.date, 'day');
    //     });
    //   });
    // };

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

  actions: {
    approve () {
      this.get('approve')(...arguments);
    },

    reject () {
      this.get('reject')(...arguments);
    },

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

    focusRequest ( request ) {
      // Wait for any unfocus events to propagate
      run.next(() => {
        this.set('focusedRequest', request);
      });
    },

    unfocusRequest () {
      this.set('focusedRequest', null);
    }
  }
});
