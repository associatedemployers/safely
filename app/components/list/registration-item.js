import Ember from 'ember';
import moment from 'moment';

const { Component, computed } = Ember;

const ListRegistrationItemComponent = Component.extend({
  tagName: 'tr',

  allowCancel: computed('registration.start', function () {
    return moment().isBefore(this.get('registration.start'));
  })
});

ListRegistrationItemComponent.reopenClass({
  positionalParams: [ 'registration' ]
});

export default ListRegistrationItemComponent;
