import Component from '@glimmer/component';

export default class HubOrganizationSwitcherComponent extends Component {
  get nextValue () {
    const nextIndex = this.args.orgs.indexOf(this.args.org) + 1;
    return this.args.orgs[nextIndex > this.args.orgs.length - 1 ? 0 : nextIndex];
  }
}
