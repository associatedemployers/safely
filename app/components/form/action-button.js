import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  tagName: 'button',
  classNameBindings: [ 'loading:is-loading' ],
  attributeBindings: [ 'type', '_disabled:disabled' ],
  _disabled: computed.or('loading', 'disabled')
});
