import { typeOf } from '@ember/utils';
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize (serialized) {
    return typeOf(serialized) === 'array' ? serialized : [];
  },

  serialize (deserialized) {
    var type = typeOf(deserialized);
    if ( type === 'array' ) {
      return deserialized;
    } else if ( type === 'string' ) {
      return deserialized.split(',').map(item => $.trim(item));
    } else {
      return [];
    }
  }
});
