import Ember from 'ember';

export default Ember.Mixin.create({
  limit: 10,
  queryParams: {
    page: {
      refreshModel: true
    },
    sortBy: {
      refreshModel: true
    },
    sortAsc: {
      refreshModel: true
    }
  },

  model ( params ) {
    const modelName = this.get('modelName'),
          filters = this.get('filterSettings'),
          page = params.page - 1;

    Ember.assert('You must specify a modelName.', modelName);

    let query = {
      page: page || 0,
      limit: this.get('controller.limit') || this.get('limit'),
      sort: {}
    };

    query.sort[params.sortBy] = params.sortAsc ? -1 : 1;

    if ( filters ) {
      filters.forEach(filter => {
        if ( params[filter.name] ) {
          Ember.$.extend(query, filter.merge(params));
        }
      });
    }

    return this.store.query(modelName, query);
  }
});
