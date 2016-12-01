import Ember from 'ember';

const { Mixin, computed } = Ember;

export default Mixin.create({
  limit: 10,
  __totalItems: computed.reads('model.meta.totalRecords'),
  __metadataTotalItems: computed.reads('metadata.totalRecords'),

  pages: computed('__totalItems', '__metadataTotalItems', 'limit', function () {
    let total = this.get('__totalItems') || this.get('__metadataTotalItems') || 0;
    return Math.ceil(total / this.get('limit'));
  })
});
