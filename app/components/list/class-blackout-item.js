import Ember from 'ember';

const { Component } = Ember;

let ClassBlackoutItemComponent =  Component.extend({
  tagName: 'tr',

  actions: {
    delete () {
      this.get('onDelete')(this.get('model'));
    }
  }
});

ClassBlackoutItemComponent.reopenClass({
  positionalParams: [ 'model' ]
});

export default ClassBlackoutItemComponent;
