import { reads } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  limit: 10,
  __totalItems: reads('model.meta.totalRecords'),
  __metadataTotalItems: reads('metadata.totalRecords'),

  pages: computed('__totalItems', '__metadataTotalItems', 'limit', function () {
    let total = this.get('__totalItems') || this.get('__metadataTotalItems') || 0;
    return Math.ceil(total / this.get('limit'));
  })
});
