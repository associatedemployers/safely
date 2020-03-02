import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default class HubRegisterParticipantsComponent extends Component {
  @service store
  @tracked participants = A()

  constructor () {
    super(...arguments);

    if (!this.participants.length) {
      this.participants.addObject(this.store.createRecord('hub-participant'));
    }
  }
}
