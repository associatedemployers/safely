import { assert } from '@ember/debug';
import $ from 'jquery';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  modelDefaults: {},

  model () {
    const modelName = this.get('modelName'),
          defaults = this.get('modelDefaults'),
          getDefaults = this.getModelDefaults;

    if ( getDefaults && typeof getDefaults === 'function' ) {
      $.extend(defaults, this.getModelDefaults());
    }

    assert('You must specify a modelName.', modelName);

    return this.store.createRecord(modelName, defaults);
  },

  actions: {
    willTransition ( transition ) {
      var model = this.controller.get('model');

      if ( !model || !model.get('isNew') ) {
        return true;
      }

      if ( Object.keys(model.changedAttributes()).length > 0 && !confirm('Are you sure you want to abandon progress on this page?') ) {
        transition.abort();
      } else {
        model.destroyRecord();
        return true;
      }
    }
  }
});
