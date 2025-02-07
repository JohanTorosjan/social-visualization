import { module, test } from 'qunit';
import { setupTest } from 'social-visualization/tests/helpers';

module('Unit | Service | post-stream', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:post-stream');
    assert.ok(service);
  });
});
