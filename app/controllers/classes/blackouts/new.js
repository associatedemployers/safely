import { A } from '@ember/array';
import $ from 'jquery';
import Controller from '@ember/controller';
import moment from 'moment';
import addEdit from 'safely/mixins/controller-abstractions/add-edit';

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
      $('select[name="select-class"]').val('');
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
        this.set('model.blocks', A());
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
