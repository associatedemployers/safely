import DS from 'ember-data';
import Ember from 'ember';
import AjaxServiceSupport from 'ember-ajax/mixins/ajax-support';

export default DS.RESTAdapter.extend(AjaxServiceSupport, {
  namespace: '/api/v1',

  pathForType ( type ) {
    return Ember.String.pluralize(type);
  }
});
