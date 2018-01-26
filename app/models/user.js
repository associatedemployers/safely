import DS from 'ember-data';
import attr from 'ember-data/attr';

export default DS.Model.extend({
  name: attr(),
  email: attr('string'),
  administrative: attr('boolean'),
  activatedOn: attr('date'),
  password: attr('string')
});
