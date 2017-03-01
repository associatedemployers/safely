import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('register');
  this.route('classes', function() {
    this.route('add');
    this.route('class', function() {});
    this.route('blackouts', function() {
      this.route('new');
    });
  });
  this.route('check-in');
  this.route('companies', function() {
    this.route('add');
  });
  this.route('seats', function() {
    this.route('add');
  });

  // this.route('error');
  this.route('not-found');
  this.route('unauthorized');
  this.route('catchall', {path: '/*wildcard'});
  this.route('registrations');
  this.route('activate', { path: '/activate/:id' });
  this.route('available-times', function() {
    this.route('new');
  });
});

export default Router;
