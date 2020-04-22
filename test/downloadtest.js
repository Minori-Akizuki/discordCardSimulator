const downloader = require('../util/download.js')();
const expect = require('expect');

const URL = 'https://cdn.discordapp.com/attachments/699257818536083516/702328325737021460/test.csv'

describe('クラス機能チェック(Randomizer)', function() {
  it('DL機能', async function() {
    const txt = await downloader.downloadTextFileFromURL(URL);
    expect(txt).toEqual('a,b,c\n1,2,3\n4,5,6');
  });
});
