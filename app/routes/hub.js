import Route from '@ember/routing/route';

export default Route.extend({
  title (tokens) {
    return [ ...tokens, 'Associated Employers & MSSC Classes' ].join(' | ');
  }
});
