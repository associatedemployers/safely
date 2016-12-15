import Ember from 'ember';
import moment from 'moment';

const { Component, computed } = Ember;

export default Component.extend({
  tagName: 'button',
  classNames: [ 'cal__avail-button', 'button', 'is-outlined'],
  classNameBindings: [
    'block.lowSeats:is-warning:is-dark',
    'inActiveBlocks:cal__avail-button--active',
    'unsuitable:cal__avail-button--unsuitable',
    'noSeats:cal__avail-button--no-seats',
    'loading:is-loading'
  ],

  loading: computed.and('hover', 'loadingState'),
  noSeats: computed.equal('block.information.seats', 0),

  mouseEnter () {
    if ( this.get('hover') ) {
      return;
    }

    this.set('hover', true);
    this.get('focusBlock')(this.get('block.originalBlock'), this.get('date'));
  },

  mouseLeave () {
    this.set('hover', false);
    this.get('unfocusBlock')(this.get('block.originalBlock'));
  },

  click () {
    let date = moment(this.get('date')).hour(this.get('block.originalBlock')[0]).toDate();
    this.get('onClick')(date);
  },

  dateString: computed('date', function () {
    return moment(this.get('date')).format('M/D/YY');
  }),

  toolTipMessage: computed('registerWarning', 'unsuitable', function () {
    let registerWarning = this.get('registerWarning'),
        unsuitable = this.get('unsuitable');

    return unsuitable ? 'Unsuitable block for your requirements. Please try another' : registerWarning ? registerWarning : 'Click to Book';
  }),

  inActiveBlocks: computed('activeBlocks.[]', 'block.originalBlock.[]', 'date', function () {
    const b = this.get('block.originalBlock'),
          date = this.get('dateString'),
          blocks = this.get('activeBlocks');

    return blocks ? blocks.find(a => {
      return a.date === date && a.block[0] === b[0] && a.block[1] === b[1];
    }) : false;
  }),

  unsuitable: computed('inActiveBlocks', 'hover', function () {
    return !this.get('inActiveBlocks') && this.get('hover') ? true : false;
  })
});
