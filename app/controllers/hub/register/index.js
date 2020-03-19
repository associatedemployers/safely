import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import mapStyle from 'safely/styles/map';

export default class HubRegisterIndexController extends Controller {
  mapStyle = mapStyle
  companyInformationOpen = true
  classInformationOpen = true
  paymentOpen = true
  @service cart
  @service data
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

  get invalid () {
    const requiredRegistrationKeys = [
      'companyName',
      'addressLine1',
      'addressCity',
      'addressState',
      'addressZipcode',
      'email',
      'firstName',
      'lastName'
    ];

    const {
      model: { cartRecord },
      flattenedParticipants,
      filledFlattenedParticipants
    } = this;

    if (flattenedParticipants.length !== filledFlattenedParticipants.length) {
      return 'Some participant information is incomplete.';
    }

    const invalidKeys = requiredRegistrationKeys.filter(k => !cartRecord[k]);

    if (invalidKeys.length) {
      return `The following fields are required: ${invalidKeys.join(', ')}.`;
    }

    return false;
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

    await this.cart.resetCart();
    this.transitionToRoute('hub.index');
  }

  @action
  async submitRegistration () {
    if (this.invalid) {
      return;
    }

    const {
      model: {
        cartRecord: {
          firstName,
          lastName,
          email,
          po,
          companyName,
          addressLine1,
          addressLine2,
          addressCity,
          addressState,
          addressZipcode
        }
      },
      registrations
    } = this;

    const { success, error } = this.data.createStatus('registration');

    let createdRegistrations = [];

    for (let i = 0; i < registrations.length; i++) {
      const {
        participants,
        hubClass
      } = registrations[i];

      try {
        let participantRecords = [];

        for (let pi = 0; pi < participants.length; pi++) {
          participantRecords.push(await this.store.createRecord('hub-participant', participants[pi]).save());
        }

        let registration = this.store.createRecord('hub-registration', {
          firstName,
          lastName,
          email,
          po,
          companyName,
          addressLine1,
          addressLine2,
          addressCity,
          addressState,
          addressZipcode,
          hubClass,
          participants: participantRecords
        });

        registration = await registration.save();
        createdRegistrations.push(registration);
      } catch (e) {
        return error(e);
      }
    }

    success('Successfully registered.');
    await this.cart.resetCart();
    this.transitionToRoute('hub.register.complete');
  }
}
