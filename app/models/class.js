import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  name:        attr('string'),
  description: attr('string'),
  hours:       attr('number'),
  created:     attr('date', {
    defaultValue: () => new Date()
  })
});
