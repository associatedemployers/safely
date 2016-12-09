import Ember from 'ember';
import authenticated from 'safely/mixins/authenticated';

const { Route } = Ember;

export default Route.extend(authenticated, {});
