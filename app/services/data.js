import Service, { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { map } from 'rsvp';
import { A } from '@ember/array';
import { notifyDefaults } from 'safely/config';
import ENV from 'safely/config/environment';

const IS_TEST = ENV.environment === 'test';

function searchError (errors) {
  const detailKeys = A([ 'detail', 'message', 'title', 'status' ]),
        key = detailKeys.find(k => errors[0][k]);

  return key ? errors.mapBy(key).join(', ') : errors[0];
}

function findFieldErrors (errors = []) {
  let fe = errors.reduce((fieldErrors, err) => {
    if (err && err.path) {
      fieldErrors[err.path] = err.detail || err.title;
    }

    return fieldErrors;
  }, {});

  return Object.keys(fe).length > 0 ? fe : false;
}

export default class DataService extends Service {
  @service('notification-messages') notifications
  statuses = {}
  __longRunningProps = {}
  enableNotify = true
  transitionWithModel = true
  successMessageTimeout = 3
  slowRunningThreshold = 500

  notify (type) {
    const notifications = this.get('notifications'),
          args = Array.prototype.slice.call(arguments, 1);

    args[1] = Object.assign({}, notifyDefaults, args[1]);

    if (IS_TEST) {
      args[1].clearDuration = 1;
    }

    notifications[type].apply(notifications, args);
  }

  getModelValidations (model) {
    const validations = get(model, 'validations.messages');

    if (!validations.length) {
      return;
    }

    return validations.map(x => `\n\u2022 ${x}`);
  }

  _validateModel (model, fields) {
    if (!fields) {
      return false;
    }

    let invalidFields = [];

    fields.forEach(field => {
      if (!get(model, field)) {
        invalidFields.push(field);
      }
    });

    return invalidFields.length > 0 ? invalidFields : false;
  }

  _afterSave (record) {
    const transitionAfterSave = this.get('transitionAfterSave');

    if (transitionAfterSave) {
      let transitionArgs = [ transitionAfterSave ];

      if (this.get('transitionWithModel')) {
        transitionArgs.push(record.get(this.getWithDefault('modelIdentifier', 'id')));
      }

      this.transitionToRoute.apply(this, transitionArgs);
    }
  }

  async saveRecord (_model, label = 'working', notify = true, requireFields) {
    if (!_model) {
      return;
    }

    const { success, error } = this.createStatus(label, notify);

    if (get(_model, 'length')) {
      await map(_model, (m, i) => this.saveRecord(m, `label${i}`, false, requireFields));
      success('Successfully saved.');
      return;
    }

    let invalid = this._validateModel(_model, requireFields),
        validationsError = this.get('enableModelValidations') && await this.getModelValidations(_model);

    if (validationsError) {
      throw validationsError;
    }

    if (invalid) {
      let requireFieldDescriptors = get(this, 'requireFieldDescriptors'),
          invalidMessage = 'You must specify these fields: ' + invalid.map(field => {
            return requireFieldDescriptors ? requireFieldDescriptors[field] || field : field;
          }).join(', ');

      throw invalidMessage;
    }

    let record;

    try {
      record = await _model.save();

      success('Successfully saved.');

      if (this.afterSave && typeof this.afterSave === 'function') {
        this.afterSave(record);
      }

      this._afterSave(record);
    } catch (e) {
      error(e);
      return false;
    }
    return record;
  }

  createStatus (label = 'working', notify = true) {
    this.set(`statuses.${label}`, {
      isLoading: true,
      isLoaded:  false,
      isSlow:    false,
      error:     null
    });

    return {
      success: this.ajaxSuccess.bind(this, {
        label,
        notify
      }),
      error: this.ajaxError.bind(this, {
        label,
        notify
      })
    };
  }

  ajaxError ({ label, notify }, err, user) {
    this.__cancelLongRunningProp(label);

    let errMsg = err ? err.payload || err.responseText || err.message || err : err,
        errorsArray = errMsg && errMsg.errors;

    if (errorsArray) {
      errMsg = typeof errMsg.errors[0] === 'string' ? errorsArray : searchError(errorsArray);
    }

    if (err && !user) {
      console.error(err.stack || err); /* eslint-disable-line */
    }

    this.set(`statuses.${label}`, {
      isLoading: false,
      isLoaded:  false,
      isSlow:    false,
      error:     {
        message:     errMsg,
        stack:       (err || {}).stack,
        fieldErrors: errorsArray && findFieldErrors(errorsArray)
      }
    });

    if (notify) {
      this.notify('error', 'Whoops! ' + errMsg);
    }
  }

  ajaxSuccess ({ label, notify }, success, silent) {
    this.__cancelLongRunningProp(label);

    this.set(`statuses.${label}`, {
      isLoading: false,
      isLoaded:  true,
      isSlow:    false,
      message:   success,
      error:     null
    });

    if (success && this.successMessageTimeout) {
      setTimeout(() => {
        if (!this.get('isDestroyed') && !this.get('isDestroying')) {
          this.set(`statuses.${label}`, {
            isLoading: false,
            isLoaded:  true,
            isSlow:    false,
            message:   null,
            error:     null
          });
        }
      }, this.successMessageTimeout * 1000);
    }

    if (!silent && notify) {
      this.notify('success', success || 'Successfully saved.');
    }
  }

  __cancelLongRunningProp (label) {
    const timeoutId = this.get(`__longRunningProps.${label}`);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  __scheduleLongRunningProp (label) {
    this.set(`__longRunningProps.${label}`, setTimeout(() => {
      if (!this.get('isDestroyed') && this.get(`statuses.${label}.isLoading`)) {
        this.set(`statuses.${label}.isSlow`, true);
      }
    }, this.slowRunningThreshold));
  }
}
