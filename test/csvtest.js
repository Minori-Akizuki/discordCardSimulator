const csvreader = require('../util/csv2deck')();
const URL = 'https://cdn.discordapp.com/attachments/699257818536083516/702328325737021460/test.csv'

describe('クラス機能チェック(csv2deck)', function() {
  it('CSV読み込み', async function() {
    const json = await csvreader.readcsv('external/consumer.csv');
  });
});
