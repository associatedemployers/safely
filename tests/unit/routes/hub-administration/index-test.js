import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | hub-administration/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:hub-administration/index');
    assert.ok(route);
  });
});
