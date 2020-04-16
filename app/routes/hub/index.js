import Route from '@ember/routing/route';
import { get } from '@ember/object';

const BANNER_MIX_RATE = 2;

export default class HubIndexRoute extends Route {
  queryParams = { org: { refreshModel: true } }

  async model ({ org }) {
    let classQuery = {
      $report: 'withAvailability',
      sort:    { 'times.0.start': 1 }
    };

    if (org) {
      classQuery.organization = org;
    }

    const classes = await this.store.query('hub-class', classQuery);

    return {
      classes,
      banners: await this.store.query('hub-banner', {
        $report:    'assortment',
        nDocuments: Math.max(Math.ceil(classes.length / BANNER_MIX_RATE), 1)
      })
    };
  }

  setupController (controller, model) {
    controller.setProperties({ model: this.mixInBanners(model.classes, model.banners) });
  }

  mixInBanners (classes, banners) {
    return classes.toArray().reduce((mixedModel, cl, i) => {
      const previousModel = classes.objectAt(i - 1),
            classLastStart = get(cl, 'times.lastObject.start');

      if (!previousModel || !moment(get(previousModel, 'times.lastObject.start')).isSame(classLastStart, 'month')) {
        mixedModel.push({
          type: 'header',
          text: `${moment(classLastStart).format('MMMM YYYY')}`
        });
      }

      mixedModel.push(cl);

      if (!((i + 1) % BANNER_MIX_RATE)) {
        let banner = banners.objectAt((i + 1) / BANNER_MIX_RATE - 1);

        if (banner) {
          mixedModel.push(banner);
        }
      }

      return mixedModel;
    }, []);
  }
}
