import Mixin from '@ember/object/mixin';
import AjaxHooks from '../ajax-status';

export default Mixin.create(AjaxHooks, {
  _afterSave ( record ) {
    const transitionAfterSave = this.get('transitionAfterDelete') || this.get('transitionAfterSave');

    if ( transitionAfterSave ) {
      let transitionArgs = [ transitionAfterSave ];

      if ( this.get('transitionWithModel') ) {
        transitionArgs.push(record.get(this.getWithDefault('modelIdentifier', 'id')));
      }

      this.transitionToRoute.apply(this, transitionArgs);
    }
  },

  actions: {
    delete ( model ) {
      const _model = model || this.get('model');

      if ( !_model ) {
        return;
      }

      this.ajaxStart();

      _model.destroyRecord().then(record => {
        this.ajaxSuccess('Successfully deleted.');
        this._afterSave(record);

        if ( this.afterSave && typeof this.afterSave === 'function' ) {
          this.afterSave(record);
        }
      }).catch(this.ajaxError.bind(this));
    }
  }
});
