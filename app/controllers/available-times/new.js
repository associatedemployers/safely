import { A } from '@ember/array';
import Controller from '@ember/controller';
import addEdit from 'safely/mixins/controller-abstractions/add-edit';

export default Controller.extend(addEdit, {
  transitionAfterSave: 'available-times.index',
  transitionWithModel: false,
  availableDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  actions: {
    mutateStartDate (val) {
      this.set('model.start', val ? moment(new Date(val)).startOf('day').toDate() : val);
    },

    mutateEndDate (val) {
      this.set('model.end', val ? moment(new Date(val)).endOf('day').toDate() : val);
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
    },

    removeDay (day) {
      let days = this.get('model.days');
      days.removeObject(days.objectAt(day));
    },

    addDay (day) {
      if ( !this.get('model.days') ) {
        this.set('model.days', A());
      }

      this.get('model.days').addObject(day);
      this.set('currentDay');
    }
  }
});
