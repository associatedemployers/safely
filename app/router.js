import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('error');
  this.route('not-found');
  this.route('unauthorized');
  this.route('catchall', {path: '/*wildcard'});
  this.route('register');
});

export default Router;
