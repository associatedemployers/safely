import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  tagName: 'li',
  classNames: [ 'cal__day' ],
  classNameBindings: [ 'day.outOfMonth:cal__gray' ]
});
