import Ember from 'ember';

export default Ember.Mixin.create({
  model ( params ) {
    if ( this.get('bypassModelHook') ) {
      return this._super(...arguments);
    }

    const modelName = this.get('modelName');
    Ember.assert('You must specify a modelName.', modelName);

    return this.store.find(modelName, params.id);
  },

  actions: {
    willTransition ( transition ) {
      var model = this.controller.get('model'),
          hasChangedAttributes = Object.keys(model.changedAttributes()).length > 0;

      if ( hasChangedAttributes && !confirm('Are you sure you want to abandon progress on this page?') ) {
        transition.abort();
      } else {
        if ( hasChangedAttributes ) {
          model.rollbackAttributes();
        }

        return true;
      }
    }
  }
});
