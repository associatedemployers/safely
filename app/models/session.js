import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  token:   attr('string'),
  expires: attr('string'),
  user:    attr('string')
});
