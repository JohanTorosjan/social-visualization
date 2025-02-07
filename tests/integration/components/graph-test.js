import { module, test } from 'qunit';
import { setupRenderingTest } from 'social-visualization/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | graph', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Graph />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Graph>
        template block text
      </Graph>
    `);

    assert.dom().hasText('template block text');
  });
});
