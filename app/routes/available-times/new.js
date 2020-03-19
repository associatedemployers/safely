import Route from '@ember/routing/route';
import add from 'safely/mixins/route-abstractions/add';

export default Route.extend(add, {
  modelName: 'available-time'
});
