import Ember from 'ember';
import addEdit from 'safely/mixins/controller-abstractions/add-edit';

const { Controller } = Ember;

export default Controller.extend(addEdit, {
  transitionAfterSave: 'available-times.index',
  transitionWithModel: false,
  availableDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  actions: {
    mutateStartDate (val) {
      this.set('model.start', val ? new Date(val) : val);
    },

    mutateEndDate (val) {
      this.set('model.end', val ? new Date(val) : val);
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
    },

    removeDay (day) {
      let days = this.get('model.days');
      days.removeObject(days.objectAt(day));
    },

    addDay (day) {
      if ( !this.get('model.days') ) {
        this.set('model.days', Ember.A());
      }

      this.get('model.days').addObject(day);
      this.set('currentDay');
    }
  }
});
