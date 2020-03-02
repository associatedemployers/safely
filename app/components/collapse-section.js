import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CollapseSectionComponent extends Component {
  @action
  onToggle () {
    this.isOpen = !this.args.isOpen;
    this.args.toggled(this.isOpen);
  }
}
