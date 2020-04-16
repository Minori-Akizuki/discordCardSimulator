const GCard = require('../../ganpara/ganparacard.js');
const expect = require('expect');

const cardSpy = {
  nameJ: 'スパイ',
  nameE: 'SPY',
  kind: 'SPECIALIST CARD',
  cost: 1,
  text: '対象のプレイヤーに[確認2]',
};

describe('クラス機能チェック(GCard)', function() {
  it('カード情報登録', function() {
    const c = new GCard(cardSpy);
    console.log(c.toString());
    console.log(c.showDetail());
    expect(c.toString()).toEqual(`【${cardSpy.kind}】【${cardSpy.nameE}】 (${cardSpy.cost})`);
    expect(c.showDetail()).toEqual(`【${cardSpy.kind}】【${cardSpy.nameE}】 -${cardSpy.nameJ}- (${cardSpy.cost}) : ${cardSpy.text}`);
  });
});
