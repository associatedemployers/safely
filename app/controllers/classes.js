import Ember from 'ember';

const { Controller, inject, computed } = Ember;

export default Controller.extend({
  application: inject.controller(),
  adding: computed.equal('application.currentPath', 'classes.add')
});
