import Ember from 'ember';

const { Component } = Ember;

let ClassItemComponent =  Component.extend({
});

ClassItemComponent.reopenClass({
  positionalParams: [ 'class' ]
});

export default ClassItemComponent;
