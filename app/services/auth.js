import Ember from 'ember';
import moment from 'moment';
import ENV from 'safely/config/environment';

const { Service, inject, computed, on, RSVP: { Promise }, Logger } = Ember;

export default Service.extend({
  authUrl: '/api/v1/login',
  clock: inject.service(),
  store: inject.service(),
  ajax:  inject.service(),

  authenticated: computed.bool('token'),
  token: computed.reads('session.token'),
  userId: computed.reads('session.user'),

  initializeClock: on('init', function () {
    this.get('clock');
  }),

  /**
   * Login intent
   * @param  {String} email    User email
   * @param  {String} password User password
   * @return {Promise}         Resolves to session
   */
  login ( email, password ) {
    let data = { email, password };
    Logger.debug('AS :: Requesting authentication service', this.get('authUrl'));
    return this.get('ajax').post(this.get('authUrl'), { data })
    .then(response => {
      Logger.debug('AS :: Got server response', response);
      var session = this.get('store').createRecord('session', {
        token:   response.token,
        expires: response.expires,
        user:    response.user,
        id:      response.id
      });

      return ENV.environment === 'test' ? Promise.resolve(session) : session.save();
    })
    .then(record => {
      Logger.debug('AS :: Saved session record in localforage');
      this.set('session', record);
      this.get('currentUser');
      return record;
    });
  },

  /**
   * Logout intent
   * @return {Promise} Resolves to destroyed session
   */
  logout () {
    Logger.debug('AS :: Logout');

    if ( !this.get('session') ) {
      Logger.debug('AS :: No session available - skipping logout');
      return Promise.resolve();
    }

    Logger.debug('AS :: Destroying session');
    return this.get('session').destroyRecord()
    .then(() => {
      this.set('session', null);
    });
  },

  refreshSession () {
    if ( !this.get('authenticated') ) {
      return Promise.resolve();
    }

    return this.get('ajax').request('/api/v1/grant/' + this.get('session.id') + '/refresh', {
      method: 'POST'
    })
    .then(response => {
      let session = this.get('session');
      session.set('expires', response.expires);
      return session.save();
    });
  },

  /**
   * Initializes an existing session
   * @param  {Boolean} cleanup Cleans expirees as we get the session
   * @return {Promise}         Resolves to false or existing session
   */
  initializeExistingSession ( cleanup = true ) {
    Logger.debug('AS :: Initializing existing session');
    return this.get('store').findAll('session').then(sessions => {
      var existingSession;
      Logger.debug('AS :: Got local sessions');
      sessions.toArray().forEach(session => {
        if ( moment(session.get('expires')).isAfter(moment()) ) {
          Logger.debug('AS :: Found active session');
          existingSession = session;
        } else if ( cleanup ) {
          session.destroyRecord();
        }
      });

      if ( existingSession ) {
        this.set('session', existingSession);
      }

      return existingSession ? this.get('user').then(user => user.get('employee')).then(() => existingSession) : false;
    });
  },

  user: computed('userId', function () {
    const userId = this.get('userId');

    if ( !userId || !this.get('authenticated') ) {
      return Ember.RSVP.Promise.resolve();
    }

    return this.get('store').find('user', userId);
  }),

  isExpired: computed('clock.minute', 'session.expires', function () {
    return moment(this.get('session.expires')).isBefore(moment());
  }),

  isExpiring: computed('clock.minute', 'session.expires', function () {
    return this.get('authenticated') && moment(this.get('session.expires')).subtract(2, 'minutes').isBefore(moment());
  })
});
