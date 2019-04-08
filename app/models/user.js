import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default DS.Model.extend({
  name:           attr(),
  email:          attr('string'),
  administrative: attr('boolean'),
  dev:            attr('boolean'),
  activatedOn:    attr('date'),
  password:       attr('string'),
  company:        belongsTo('company', { async: true, inverse: null })
});
