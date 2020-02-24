/*
  Usage:
  ```
  import addEdit from 'slate-payroll/mixins/controller-abstractions/add-edit'

  export default Ember.Controller.extend(addEdit, {
    transitionWithModel: true,
    transitionAfterSave: 'index',

    actions: {
      triggerSave () {
        this.send('save');
      }
    }
  });
 */
import Mixin from '@ember/object/mixin';

import { get } from '@ember/object';
import { Promise } from 'rsvp';
import AjaxHooks from '../ajax-status';

export default Mixin.create(AjaxHooks, {
  enableNotify: true,
  transitionWithModel: true,

  _validateModel ( model ) {
    const fields = this.get('requireFields');

    if ( !fields ) {
      return false;
    }

    let invalidFields = [];

    fields.forEach(field => {
      if ( !get(model, field) ) {
        invalidFields.push(field);
      }
    });

    return invalidFields.length > 0 ? invalidFields : false;
  },

  _afterSave ( record ) {
    const transitionAfterSave = this.get('transitionAfterSave');

    if ( transitionAfterSave ) {
      let transitionArgs = [ transitionAfterSave ];

      if ( this.get('transitionWithModel') ) {
        transitionArgs.push(record.get(this.getWithDefault('modelIdentifier', 'id')));
      }

      this.transitionToRoute.apply(this, transitionArgs);
    }
  },

  saveModel ( model ) {
    const _model = model || this.get('model');

    if (this.get('preventDualAction') && this.get('working')) {
      return;
    }

    if ( !_model ) {
      return Promise.resolve();
    }

    this.ajaxStart();

    let invalid = this._validateModel(_model);

    if ( invalid ) {
      let requireFieldDescriptors = get(this, 'requireFieldDescriptors'),
          invalidMessage = 'You must specify these fields: ' + invalid.map(field => {
            return requireFieldDescriptors ? requireFieldDescriptors[field] || field : field;
          }).join(', ');

      this.ajaxError(invalidMessage, true);
      return Promise.resolve();
    }

    return _model.save().then(record => {
      this.ajaxSuccess('Successfully saved.');

      if ( this.afterSave && typeof this.afterSave === 'function' ) {
        this.afterSave(record);
      }

      this._afterSave(record);
    }).catch(this.ajaxError.bind(this));
  },

  actions: {
    save ( model ) {
      this.saveModel(model);
    }
  }
});
