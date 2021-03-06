import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  start:       attr('date'),
  end:         attr('date'),
  cancelledOn: attr('date'),
  times:       attr('array'),
  comments:    attr('string'),

  trainee: belongsTo('trainee', {
    inverse: null,
    async:   true
  }),
  company: belongsTo('company', {
    inverse: null,
    async:   true
  }),
  classes: hasMany('class', {
    inverse: null,
    async:   true
  }),

  FORCE_SQL_OP: attr('string'),

  created: attr('date', { defaultValue: () => new Date() })
});
