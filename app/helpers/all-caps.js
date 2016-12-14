import Ember from 'ember';

export function allCaps([text]/*, hash*/) {
  return text ? text.toUpperCase() : text;
}

export default Ember.Helper.helper(allCaps);
