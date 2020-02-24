import Controller from '@ember/controller';
import addEdit from 'safely/mixins/controller-abstractions/add-edit';

export default Controller.extend(addEdit, {
  transitionAfterSave: 'classes',
  transitionWithModel: false
});
