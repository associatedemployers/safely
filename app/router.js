import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('register');
  this.route('classes', function () {
    this.route('add');
    this.route('class', function () {});
    this.route('blackouts', function () {
      this.route('new');
    });
  });
  this.route('check-in');
  this.route('companies', function () {
    this.route('add');
  });
  this.route('seats', function () {
    this.route('add');
  });

  // this.route('error');
  this.route('not-found');
  this.route('unauthorized');
  this.route('catchall', { path: '/*wildcard' });
  this.route('registrations');
  this.route('activate', { path: '/activate/:id' });
  this.route('available-times', function () {
    this.route('new');
  });
  this.route('users');
  this.route('hub', function () {
    this.route('register', function () {
      this.route('complete');
    });
  });
  this.route('hub-administration', function () {
    this.route('instructors');
    this.route('registrations');

    this.route('class-information', function () {
      this.route('add');
    });

    this.route('class', function () {
      this.route('add');
    });
    this.route('banners', function () {
      this.route('add');
    });
  });
});
