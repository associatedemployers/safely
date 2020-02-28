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
  @tracked companyName = null
  @tracked companyAddressLine1 = null
  @tracked companyAddressLine2 = null
  @tracked companyAddressCity = null
  @tracked companyAddressState = 'MT'
  @tracked companyAddressZipcode = null

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

    return [ AE.isMember && 'AE', MSSC.isMember && 'MSSC' ].filter(Boolean).join('and');
  }

  autofillData () {
    const {
      // args: { model },
      memberStatus
    } = this;

    if (this.companyName || this.companyAddressLine1 || this.companyAddressCity) {
      return;
    }
    console.log(memberStatus);

    const getValueForKey = (key) =>
      [ 'AE', 'MSSC' ].map(org =>
        (memberStatus[org].data || {})[key]
      ).find(Boolean);
    console.log(
      getValueForKey('company'),
      getValueForKey('address'),
      getValueForKey('address2'),
      getValueForKey('city'),
      getValueForKey('state'),
      getValueForKey('zip')

    );

    const st = getValueForKey('state');

    this.companyName = getValueForKey('company');
    this.companyAddressLine1 = getValueForKey('address');
    this.companyAddressLine2 = getValueForKey('address2');
    this.companyAddressCity = getValueForKey('city');
    this.companyAddressState = st && st.length > 2 ? (this.states.find(s => s.label.toLowerCase() === st.toLowerCase()) || {}).value : st;
    this.companyAddressZipcode = getValueForKey('zip');

    console.log(
      this.companyName,
      this.companyAddressLine1,
      this.companyAddressLine2,
      this.companyAddressCity,
      this.companyAddressState,
      this.companyAddressZipcode
    );
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

    this.isFetchingMember = false;
    this.existingCompany = existingCompany;

    if (this.memberStatus.memberOfOneOrg) {
      this.autofillData();
    }
  }
}
