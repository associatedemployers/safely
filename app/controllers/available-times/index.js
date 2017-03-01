import Ember from 'ember';
import del from 'safely/mixins/controller-abstractions/delete';

const { Controller } = Ember;

export default Controller.extend(del, {
});
