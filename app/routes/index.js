import Route from '@ember/routing/route';
import authenticated from 'safely/mixins/authenticated';

export default Route.extend(authenticated, {});
