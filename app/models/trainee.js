import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

const { computed } = Ember;

export default Model.extend({
  name: attr({
    defaultValue: () => {
      return {};
    }
  }),
  email: attr('string'),
  ssn: attr('string'),
  FORCE_SQL_OP:   attr('string'),

  company: hasMany('company'),

  created: attr('date', {
    defaultValue: () => new Date()
  }),

  ssnMasked: computed('ssn', function () {
    return (this.get('ssn') || '').replace(/\D/g, '').replace(/(\d{5})(\d{4})/, '***-**-$2');
  })
});
