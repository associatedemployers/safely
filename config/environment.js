'use strict';

module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'safely',
    environment:  environment,
    rootURL:      '/',
    locationType: 'auto',
    moment:       {
      // Options:
      // 'all' - all years, all timezones
      // 'subset' - subset of the timezone data to cover 2010-2020 (or 2012-2022 as of 0.5.12). all timezones.
      // 'none' - no data, just timezone API
      includeTimezone: 'all'
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'ember-cli-notifications': { includeFontAwesome: false },

    'ember-google-maps': {
      key:      'AIzaSyA14owHjNkrL_9YrNZfZDyEKMygkDfzXbU',
      language: 'en',
      region:   'US',
      protocol: 'https',
      version:  '3.35'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
