import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | hub-administration/instructors', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:hub-administration/instructors');
    assert.ok(route);
  });
});
