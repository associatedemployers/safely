import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

let AvailableTimeItemComponent =  Component.extend({
  tagName: 'tr',

  days: computed('model.days', function () {
    return (this.get('model.days') || []).map(day => moment(day, 'd').format('dddd'));
  }),

  actions: {
    delete () {
      this.get('onDelete')(this.get('model'));
    }
  }
});

AvailableTimeItemComponent.reopenClass({
  positionalParams: [ 'model' ]
});

export default AvailableTimeItemComponent;
