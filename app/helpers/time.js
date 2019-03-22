import Ember from 'ember';
import moment from 'moment';

export function time([date, format = 'M/D/YY']) {
  return date ? format.indexOf('z') > -1 ? moment.tz(date, moment.tz.guess()).format(format) : moment(date).format(format) : 'N/A';
}

export default Ember.Helper.helper(time);
