import Ember from 'ember';
import add from 'safely/mixins/route-abstractions/add';

const { Route } = Ember;

export default Route.extend(add, {
  modelName: 'class'
});
