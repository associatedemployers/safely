import Ember from 'ember';
import moment from 'moment';

const { Component, computed } = Ember;

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
