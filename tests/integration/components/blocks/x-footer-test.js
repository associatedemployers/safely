import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('blocks/x-footer', 'Integration | Component | blocks/x footer', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{blocks/x-footer}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#blocks/x-footer}}
      template block text
    {{/blocks/x-footer}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
