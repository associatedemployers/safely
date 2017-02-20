import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('list/class-blackout-item', 'Integration | Component | list/class blackout item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{list/class-blackout-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#list/class-blackout-item}}
      template block text
    {{/list/class-blackout-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
