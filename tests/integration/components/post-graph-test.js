import { module, test } from 'qunit';
import { setupRenderingTest } from 'social-visualization/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | post-graph', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<PostGraph />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <PostGraph>
        template block text
      </PostGraph>
    `);

    assert.dom().hasText('template block text');
  });
});
