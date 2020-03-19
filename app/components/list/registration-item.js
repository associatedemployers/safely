import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

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
