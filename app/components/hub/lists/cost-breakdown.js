import Component from '@glimmer/component';
import { get } from '@ember/object';

export default class HubListsCostBreakdownComponent extends Component {
  get total () {
    const {
      model: {
        participants,
        isClassMember,
        hubClass: {
          memberPrice,
          nonMemberPrice,
          memberAddParticipantsPrice,
          nonMemberAddParticipantsPrice
        }
      }
    } = this.args;

    const participant = isClassMember ? memberPrice : nonMemberPrice,
          addParticipant = isClassMember ? memberAddParticipantsPrice : nonMemberAddParticipantsPrice,
          additionalParticipantsCount = get(participants || [], 'length') - 1;

    return participant && addParticipant ? participant + (additionalParticipantsCount > 0 ? additionalParticipantsCount * addParticipant : 0) : 'N/A';
  }
}
