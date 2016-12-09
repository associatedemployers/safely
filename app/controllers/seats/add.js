import Ember from 'ember';
import addEdit from 'safely/mixins/controller-abstractions/add-edit';

const { Controller } = Ember;

export default Controller.extend(addEdit, {
  transitionAfterSave: 'seats',
  transitionWithModel: false
});