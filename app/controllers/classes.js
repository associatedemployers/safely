import { equal } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  application: controller(),
  inTopRoute: equal('application.currentPath', 'classes.index')
});
