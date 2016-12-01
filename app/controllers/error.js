import Ember from 'ember';

export default Ember.Controller.extend({
  clientError: Ember.computed('fromError', function () {
    var error = this.get('fromError');
    return error && error.status === 400;
  })
});
