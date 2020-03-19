import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { throttle, cancel } from '@ember/runloop';
import { states } from 'safely/config/statics';

export default class HubRegisterCompanyFormComponent extends Component {
  @service ajax
  memberCheckThrottleMs = 2000
  states = states
  @tracked isFetchingMember = false
  @tracked memberStatus = {}
  @tracked existingCompany = null

  enqueueMemberCheck () {
    this.throttleId = throttle(this, this.memberCheck, this.memberCheckThrottleMs, false);
  }

  get memberString () {
    const {
      AE,
      MSSC,
      memberOfOneOrg
    } = this.memberStatus || {};

    if (!AE || !MSSC || !memberOfOneOrg) {
      return '';
    }

    return [ AE.isMember && 'AE', MSSC.isMember && 'MSSC' ].filter(Boolean).join(' and ');
  }

  autofillData () {
    const { memberStatus } = this;

    if (this.args.model.companyName || this.args.model.companyAddressLine1 || this.args.model.companyAddressCity) {
      return;
    }

    const getValueForKey = (key) =>
      [ 'AE', 'MSSC' ].map(org =>
        (memberStatus[org].data || {})[key]
      ).find(Boolean);

    const st = getValueForKey('state');

    this.args.model.companyName = getValueForKey('company');
    this.args.model.addressLine1 = getValueForKey('address');
    this.args.model.addressLine2 = getValueForKey('address2');
    this.args.model.addressCity = getValueForKey('city');
    this.args.model.addressState = st && st.length > 2 ? (this.states.find(s => s.label.toLowerCase() === st.toLowerCase()) || {}).value : st;
    this.args.model.addressZipcode = getValueForKey('zip');
  }

  @action
  updatedEmail () {
    this.enqueueMemberCheck();
  }

  willDestroy () {
    cancel(this.throttleId);
  }

  @action
  async memberCheck () {
    this.isFetchingMember = true;
    try {
      var { memberStatus, existingCompany } = await this.ajax.request('/api/v1/hub-company/retrieve', { data: { email: this.args.model.email } });
    } catch (err) {
      this.fetchError = err;
      this.isFetchingMember = false;
      return;
    }

    this.memberStatus = (memberStatus || []).reduce((memberObj, orgSegment) => {
      return {
        ...memberObj,
        [orgSegment.org]: {
          isMember: orgSegment.isMember,
          data:     orgSegment.company
        }
      };
    }, { memberOfOneOrg: memberStatus.some(r => r.isMember) });

    this.args.onMemberStatusChange(this.memberStatus);

    this.isFetchingMember = false;
    this.existingCompany = existingCompany;

    if (this.memberStatus.memberOfOneOrg) {
      this.autofillData();
    }
  }
}
