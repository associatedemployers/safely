import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  start: attr('date'),
  end: attr('date'),
  seats: attr('number'),

  classExceptions: hasMany('class', { inverse: null }),
  blocks: attr('array')
});
