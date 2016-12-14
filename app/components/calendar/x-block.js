import Ember from 'ember';
import moment from 'moment';

const { Component, computed } = Ember;

export default Component.extend({
  tagName: 'button',
  classNames: [ 'cal__avail-button', 'button', 'is-outlined' ],
  classNameBindings: [ 'block.lowSeats:is-warning:is-dark', 'inActiveBlocks:cal__avail-button--active' ],

  mouseEnter () {
    this.get('focusBlock')(this.get('block.originalBlock'), this.get('date'));
  },

  mouseLeave () {
    this.get('unfocusBlock')(this.get('block.originalBlock'));
  },

  dateString: computed('date', function () {
    return moment(this.get('date')).format('M/D/YY');
  }),

  inActiveBlocks: computed('activeBlocks.[]', 'block.originalBlock.[]', 'date', function () {
    const b = this.get('block.originalBlock'),
          date = this.get('dateString'),
          blocks = this.get('activeBlocks');

    return blocks ? blocks.find(a => {
      return a.date === date && a.block[0] === b[0] && a.block[1] === b[1];
    }) : false;
  })
});
