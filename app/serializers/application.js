import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
  normalize (modelClass, hash) {
    if ( !hash.id && hash._id ) {
      hash.id = hash._id;
    }

    delete hash._id;
    delete hash.__v;

    return this._super(...arguments);
  }
});
