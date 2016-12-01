import Ember from 'ember';
import moment from 'moment';

export function time([date, format = 'M/D/YY']) {
  return date ? moment(date).format(format) : 'N/A';
}

export default Ember.Helper.helper(time);
