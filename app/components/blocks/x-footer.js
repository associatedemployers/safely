import Ember from 'ember';
import moment from 'moment';

const { Component, inject } = Ember;

export default Component.extend({
  tagName: 'footer',
  classNames: [ 'footer' ],
  auth: inject.service(),
  year: moment().format('YYYY'),

  actions: {
    logout () {
      this.get('logout')();
    }
  }
});
