import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

const eventColors = {
  AE:   '#032785',
  MSSC: '#0f7b2d'
};

export default class HubIndexController extends Controller {
  queryParams = [ 'calendarView', 'org' ]
  @service cart
  @tracked calendarView = false
  @tracked org = null
  orgs = [ null, 'AE', 'MSSC' ]

  calendarHeader= { center: 'month,agendaWeek' }

  calendarViews = {
    month:  { displayEventEnd: true },
    agenda: {}
  }

  get tlWormholeTarget () {
    return document.querySelector('.ember-application');
  }

  get calendarItems () {
    return this.model.filter(model => ((model || {}).constructor || {}).modelName === 'hub-class')
    .reduce((events, model) => {
      const { times } = model,
            inCart = ((this.cart.state || {}).items || []).includes(model);

      const baseEvent = {
        backgroundColor: eventColors[model.organization],
        title:           `${model.get('classInformation.name')}
                          by ${model.get('instructor.displayName')}
                          ${inCart ? 'In cart, click to remove' : 'Click to add to cart'}`,
        id:              model.id,
        allDay:          false,
        hubClass:        model,
        displayEventEnd: true
      };

      return [ ...events, ...times.map(time => ({
        ...baseEvent,
        start: time.start,
        end:   time.end
      })) ];
    }, []);
  }

  @action
  addEventToCart (ev) {
    this.addToCart(ev.hubClass);
  }

  @action
  async addToCart (model) {
    if (model.isFull) {
      return;
    }

    if (this.cart.state.items.includes(model)) {
      await this.cart.removeItem(model);
    } else {
      await this.cart.addItem(model);
    }
  }
}
