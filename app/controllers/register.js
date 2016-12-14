import Ember from 'ember';

const { Controller, computed } = Ember;

export default Controller.extend({
  hours: computed('selectedClasses.[]', function () {
    const classes = this.get('selectedClasses');
    return classes ? classes.reduce((sum, i) => sum + i.get('hours'), 0) : 0;
  })
});
