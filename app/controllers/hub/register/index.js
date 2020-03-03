import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A } from '@ember/array';
import mapStyle from 'safely/styles/map';

export default class HubRegisterIndexController extends Controller {
  mapStyle = mapStyle
  companyInformationOpen = true
  classInformationOpen = true
  paymentOpen = true
  @tracked usingCopyAll = A()
  @tracked allParticipants = []

  get flattenedParticipants () {
    return A(this.allParticipants.flat()).uniq();
  }

  get filledFlattenedParticipants () {
    return this.filledFlattenedParticipants.filter(p => {
      return p.firstName || p.lastName;
    });
  }

  get registrations () {
    const {
      model: { cart },
      usingCopyAll,
      allParticipants
    } = this;

    return cart.map((hubClass, i) => {
      const participants = usingCopyAll.includes(i) ? allParticipants[0] : allParticipants[i];

      return {
        hubClass,
        participants
      };
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
