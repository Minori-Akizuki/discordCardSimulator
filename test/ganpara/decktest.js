const decks = require('../../ganpara/deck');

describe('クラス機能チェック(decks)', function() {
  it('クラス機能チェック', async function() {
    const dk = await decks.customdeck('consumer');
  });
});
