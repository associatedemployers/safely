import Ember from 'ember';
import moment from 'moment';
import addEdit from 'safely/mixins/controller-abstractions/add-edit';

const { Controller } = Ember;

export default Controller.extend(addEdit, {
  transitionAfterSave: 'classes.blackouts.index',
  transitionWithModel: false,

  actions: {
    mutateStartDate (val) {
      this.set('model.start', val ? moment(val).startOf('day').toDate() : val);
    },

    mutateEndDate (val) {
      this.set('model.end', val ? moment(val).endOf('day').toDate() : val);
    },

    selectClass (val) {
      let index = parseFloat(val);

      if (isNaN(index)) {
        return;
      }

      this.get('model.classExceptions').addObject(this.get('availableClasses').objectAt(index));
      Ember.$('select[name="select-class"]').val('');
    },

    removeClass (item) {
      this.get('model.classExceptions').removeObject(item);
    },

    addBlock (block) {
      let b = block.split('-');

      if (b.length < 2) {
        return;
      }

      if ( !this.get('model.blocks') ) {
        this.set('model.blocks', Ember.A());
      }

      this.get('model.blocks').addObject(b);
      this.set('currentBlock');
    },

    removeBlock (blockIndex) {
      let blocks = this.get('model.blocks');
      blocks.removeObject(blocks.objectAt(blockIndex));
    }
  }
});
