import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default class HubRegisterParticipantsComponent extends Component {
  @service store
  @tracked participants = A()
  @tracked copiedParticipants = {}

  constructor () {
    super(...arguments);

    if (!this.participants.length) {
      this.addParticipant();
    }
  }

  get notFirstClass () {
    return this.args.classIndex > 0;
  }

  @action
  addParticipant () {
    this.participants.addObject(this.store.createRecord('hub-participant'));
    this.args.onParticipantsChanged(this.participants);
  }

  @action
  removeParticipant (participant) {
    this.participants.removeObject(participant);
    this.args.onParticipantsChanged(this.participants);
  }
}
