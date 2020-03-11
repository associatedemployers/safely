import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import mapStyle from 'safely/styles/map';
import registrations from '../../registrations';

export default class HubRegisterIndexController extends Controller {
  mapStyle = mapStyle
  companyInformationOpen = true
  classInformationOpen = true
  paymentOpen = true
  @service cart
  @tracked usingCopyAll = A()
  @tracked allParticipants = []

  get flattenedParticipants () {
    return A(this.allParticipants.flat()).uniq();
  }

  get filledFlattenedParticipants () {
    return this.flattenedParticipants.filter(p => {
      return p.firstName || p.lastName;
    });
  }

  get registrations () {
    const {
      model: { cart },
      usingCopyAll,
      allParticipants,
      memberStatus
    } = this;

    return cart.map((hubClass, i) => {
      const participants = usingCopyAll.includes(i) ? allParticipants[0] : allParticipants[i];

      return {
        hubClass,
        isClassMember: !!((memberStatus || {})[hubClass.organization] || {}).isMember,
        participants:  A(participants)
      };
    });
  }

  get total () {
    return (this.registrations || []).reduce((total, registration = {}) => {
      const {
        participants,
        isClassMember,
        hubClass: {
          memberPrice,
          nonMemberPrice,
          memberAddParticipantsPrice,
          nonMemberAddParticipantsPrice
        }
      } = registration;

      const participant = isClassMember ? memberPrice : nonMemberPrice,
            addParticipant = isClassMember ? memberAddParticipantsPrice : nonMemberAddParticipantsPrice,
            additionalParticipantsCount = get(participants || [], 'length') - 1;

      return total + (participant && addParticipant ? participant + (additionalParticipantsCount > 0 ? additionalParticipantsCount * addParticipant : 0) : 0);
    }, 0);
  }

  get totalMissingInformation () {
    return !!this.registrations.find(reg => {
      const {
        participants,
        isClassMember,
        hubClass: {
          memberPrice,
          nonMemberPrice,
          memberAddParticipantsPrice,
          nonMemberAddParticipantsPrice
        }
      } = reg;

      const participant = isClassMember ? memberPrice : nonMemberPrice,
            addParticipant = isClassMember ? memberAddParticipantsPrice : nonMemberAddParticipantsPrice,
            additionalParticipantsCount = get(participants || [], 'length') - 1;

      return additionalParticipantsCount > 0 ? !addParticipant || !participant : !participant;
    });
  }

  @action
  async removeClass (hubClass) {
    this.model.cartRecord.items.removeObject(hubClass);
    await this.model.cartRecord.save();
  }

  @action
  toggleCopyingParticipantSource (index) {
    this.usingCopyAll[this.usingCopyAll.includes(index) ? 'removeObject' : 'addObject'](index);
  }

  @action
  participantsChanged (index, participants) {
    this.allParticipants[index] = participants;
  }

  @action
  async resetCart () {
    if (!confirm('Are you sure you want to start over?')) {
      return;
    }

    await this.model.cartRecord.destroyRecord();
    this.transitionToRoute('hub.index');
  }
}
