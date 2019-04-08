import Ember from 'ember';
import moment from 'moment';
import { resolve } from 'rsvp';

const { Component, computed } = Ember;

const ListRegistrationItemComponent = Component.extend({
  tagName: 'tr',
  classNameBindings: [ 'registration.cancelledOn:list-item__registration--cancelled' ],

  allowCancel: computed('registration.{start,cancelledOn}', function () {
    return !this.get('registration.cancelledOn') && moment().isBefore(this.get('registration.start'));
  }),

  actions: {
    cancel () {
      this.get('onCancel')(this.get('registration'));
    },

    forceOp (op, model) {
      this.get('onForceOp')(op, model);
    }
  }
});

ListRegistrationItemComponent.reopenClass({
  positionalParams: [ 'registration' ]
});

export default ListRegistrationItemComponent;
