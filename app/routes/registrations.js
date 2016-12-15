import Ember from 'ember';
import moment from 'moment';

const { Route } = Ember;

export default Route.extend({
  queryParams: {
    range: { refreshModel: true },
    date: { refreshModel: true },
    lookback: { refreshModel: true }
  },

  model (params) {
    const { range, date, lookback } = params,
          start = moment(date || new Date()).add(lookback, range).startOf(range).toDate(),
          end = moment(date || new Date()).add(lookback, range).endOf(range).toDate();

    return this.store.query('registration', {
      $or: [{
        start: {
          $gte: start,
          $lte: end
        }
      }, {
        end: {
          $lte: end,
          $gte: start
        }
      }]
    });
  }
});
