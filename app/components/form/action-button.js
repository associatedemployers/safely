import { or } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  classNameBindings: [ 'loading:is-loading' ],
  attributeBindings: [ 'type', '_disabled:disabled' ],
  _disabled: or('loading', 'disabled')
});
