const GPlayer = require('../../ganpara/ganparaplayer.js');
const Cards = require('../../cardbase/cards.js');
const expect = require('expect');

const simpleCards5 = [1, 2, 3, 4, 5];
const pname = 'Caralina';
const getSimpleCards5 = function() {
  return simpleCards5.concat();
};
const redLife = 'REDLIFE';

describe('クラス機能チェック(GPlayer)', function() {
  it('コンストラクタ', function() {
    const p = new GPlayer(pname);
    expect(p.name).toEqual(pname);
    expect(p.life).toBeInstanceOf(Cards);
    expect(p.hand).toBeInstanceOf(Cards);
    expect(p.hand.cs).toEqual([]);
    expect(p.front).toBeInstanceOf(Cards);
    expect(p.front.cs).toEqual([]);
    expect(p.isLive).toBe(true);
    expect(p.isLifeOpened).toBe(false);
  });

  it('カードを受けとる', function() {
    const p = new GPlayer(pname);
    p.addToHand(getSimpleCards5());
    expect(p.hand.cs).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
    expect(p.hand.cs).toHaveLength(getSimpleCards5().length);
  });

  it('手札表示', function() {
    const p = new GPlayer(pname);
    p.addToHand(getSimpleCards5());
    p.life = redLife;
    expect(p.printHandWithLife()).toEqual(
        '1 : 5\n2 : 4\n3 : 3\n4 : 2\n5 : 1\nLIFE: REDLIFE');
  });

  it('カードを置く', function() {
    const p = new GPlayer(pname);
    p.addToHand(getSimpleCards5());
    p.putCardFront(2);
    expect(p.hand.cs).toEqual([5, 3, 2, 1]);
    expect(p.front.cs).toEqual([4]);
  });

  it('正面のカードを戻す', function() {
    const p = new GPlayer(pname);
    p.addToHand(getSimpleCards5());
    p.putCardFront(2);
    p.putCardFront(2);
    p.pickCardFront(1);
    expect(p.hand.cs).toEqual([3, 5, 2, 1]);
    expect(p.front.cs).toEqual([4]);
  });

  it('1枚表示する', function() {
    const p = new GPlayer(pname);
    p.addToHand(getSimpleCards5());
    expect(p.openHand(3)).toEqual('3 : 3');
  });

  it('手札をLIFE以外全て表示', function() {
    const p = new GPlayer(pname);
    p.addToHand(getSimpleCards5());
  });

  it('toString', function() {
    const p = new GPlayer(pname);
    p.life.putOn('REDLIFE');
    p.hand = new Cards([1, 2, 3, 4, 5]);
    p.front = new Cards([6, 7]);
    console.log(p.toString());
  });
});
