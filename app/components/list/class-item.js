import Ember from 'ember';

const { Component } = Ember;

let ClassItemComponent =  Component.extend({
  tagName: 'tr',

  actions: {
    delete () {
      this.get('onDelete')(this.get('class'));
    }
  }
});

ClassItemComponent.reopenClass({
  positionalParams: [ 'class' ]
});

export default ClassItemComponent;
