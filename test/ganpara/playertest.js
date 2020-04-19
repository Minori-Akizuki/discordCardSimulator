const GPlayer = require('../../ganpara/ganparaplayer.js');
const Cards = require('../../cardbase/cards.js');
const GCards = require('../../ganpara/deck_consumer.js');
const GCard = require('../../ganpara/ganparacard.js');
const expect = require('expect');
const sinon = require('sinon');

const simpleCards5 = [1, 2, 3, 4, 5];
const ganparacard = {
  redlife: new GCard( GCards.consumer().lifesIn[0]),
  gangster: new GCard( GCards.consumer().startHands.gangsters[0] ),
  money: new GCard( GCards.consumer().startHands.moneys[0] ),
  porno: new GCard({nameE: 'PORNO', nameJ: 'ポルノ', kind: 'CONTRABAND CARD', cost: '2', text: '【摘発対象】【制限1】【公開1】MONEY2枚を拾う、手に入れたターンは使用できない', back: 'PORNO'}),
};
const pname = 'Caralina';
const id = '1234';
const getSimpleCards5 = function() {
  return simpleCards5.concat();
};
const redLife = 'REDLIFE';

describe('クラス機能チェック(GPlayer)', function() {
  it('コンストラクタ', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
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
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    p.addToHand(getSimpleCards5());
    expect(p.hand.cs).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
    expect(p.hand.cs).toHaveLength(getSimpleCards5().length);
  });

  it('手札表示', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    p.addToHand(getSimpleCards5());
    p.life = redLife;
    p.printHandWithLife();
    expect(p.messengerOwn.send.calledOnceWith('1 : 5\n2 : 4\n3 : 3\n4 : 2\n5 : 1\nLIFE: REDLIFE')).toEqual(true);
  });

  it('カードを置く', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    p.addToHand(getSimpleCards5());
    p.putCardFront(2);
    expect(p.hand.cs).toEqual([5, 3, 2, 1]);
    expect(p.front.cs).toEqual([4]);
  });

  it('正面のカードを戻す', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    p.addToHand(getSimpleCards5());
    p.putCardFront(2);
    p.putCardFront(2);
    p.pickCardFront(1);
    expect(p.hand.cs).toEqual([3, 5, 2, 1]);
    expect(p.front.cs).toEqual([4]);
  });

  it('手札からカードを捨てる(普通のカード)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const m = new Cards();
    p.life.putOn(ganparacard.redlife);
    p.addToHand([ganparacard.gangster]);
    expect(p.handNum()).toEqual(2);
    p.trashHand(1, m);
    expect(p.handNum()).toEqual(1);
    expect(m.number()).toEqual(1);
  });

  it('手札からカードを捨てる(ライフ)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const m = new Cards();
    p.addToHand([ganparacard.redlife]);
    expect(p.handNum()).toEqual(1);
    p.trashHand(1, m);
    expect(p.handNum()).toEqual(0);
    expect(m.number()).toEqual(0);
    expect(p.front.number()).toEqual(1);
  });

  it('手札のライフを分ける', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    p.addToHand([ganparacard.redlife]);
    p.addToHand([ganparacard.gangster]);

    p.divideLife();

    expect(p.life.number()).toEqual(1);
    expect(p.life.cs[0].isLife).toEqual(true);
    expect(p.hand.number()).toEqual(1);
    expect(p.hand.cs[0].isLife).not.toEqual(true);
    expect(p.handNum()).toEqual(2);
  });

  it('1枚公開する', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    p.addToHand(getSimpleCards5());
    p.openCard(3);
    expect(p.messengerGloval.send.calledOnceWith('3')).toEqual(true);
  });

  it('手札をLIFE以外全て表示', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    p.addToHand(getSimpleCards5());
    p.openHand();
    expect(
        p.messengerGloval.send.calledOnceWith('1 : 5\n2 : 4\n3 : 3\n4 : 2\n5 : 1')).
        toEqual(true);
  });

  it('カードを渡す', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const t = new GPlayer('target', '0000', messengerLocal, messengerGloval);

    p.addToHand(getSimpleCards5());
    p.passACard(t, 3);

    expect(p.hand.cs).toEqual([5, 4, 2, 1]);
    expect(t.hand.cs).toEqual([3]);
  });

  it('カードを引く', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const d = new Cards(getSimpleCards5());

    p.drawACard(d);

    expect(d.cs).toEqual([2, 3, 4, 5]);
    expect(p.hand.cs).toEqual([1]);
  });

  it('ワンモアドロー処理', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const m = new Cards();
    const d = new Cards([ganparacard.gangster, ganparacard.gangster]);

    p.oneMoreDraw(d, m);

    expect(m.number()).toEqual(1);
    expect(p.handNum()).toEqual(1);
    expect(d.number()).toEqual(0);
  });

  it('確認X(手札以下)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const t = new GPlayer('target', messengerLocal, messengerGloval);
    t.hand = new Cards([ganparacard.gangster, ganparacard.money]);
    t.life = new Cards([ganparacard.redlife]);
    const peeped = p.checkX(t, 1);

    expect(peeped.number()).toEqual(1);
    expect(t.handNum()).toEqual(3);
    expect(t.life.cs[0].isLife).toEqual(true);
    expect(p.handNum()).toEqual(0);
  });

  it('確認X(特にライフが含まれることの確認)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const t = new GPlayer('target', '0000', messengerLocal, messengerGloval);
    t.hand = new Cards();
    t.life = new Cards([ganparacard.redlife]);

    const peeped = p.checkX(t, 1);

    expect(peeped.cs[0].isLife).toBeTruthy();
  });

  it('確認X(手札以上)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const t = new GPlayer('target', '0000', messengerLocal, messengerGloval);
    t.hand = new Cards([ganparacard.gangster, ganparacard.money]);
    t.life = new Cards([ganparacard.redlife]);

    const peeped = p.checkX(t, 4);

    expect(peeped.number()).toEqual(3);
  });

  it('確認X(バックのあるカード)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const t = new GPlayer('target', '0000', messengerLocal, messengerGloval);
    t.hand = new Cards([ganparacard.porno]);
    t.life = new Cards([ganparacard.redlife]);

    const peeped = p.checkX(t, 3);

    expect(peeped.number()).toEqual(1);
    expect(peeped.cs[0].isLife).toBeTruthy();
  });

  it('奪取X(機能確認)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const t = new GPlayer('target', '0000', messengerLocal, messengerGloval);
    t.hand = new Cards([ganparacard.gangster, ganparacard.money]);
    t.life = new Cards([ganparacard.redlife]);

    p.stealX(t, 2);

    expect(p.handNum()).toEqual(2);
    expect(t.handNum()).toEqual(1);
    expect(t.life.number()).toEqual(1);
  });

  it('奪取X(枚数以上)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const t = new GPlayer('target', '0000', messengerLocal, messengerGloval);
    t.hand = new Cards([ganparacard.gangster, ganparacard.money]);
    t.life = new Cards([ganparacard.redlife]);

    p.stealX(t, 3);

    expect(p.handNum()).toEqual(2);
    expect(t.handNum()).toEqual(1);
  });

  it('奪取X(バックのあるカード)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const t = new GPlayer('target', '0000', messengerLocal, messengerGloval);
    t.hand = new Cards([ganparacard.gangster, ganparacard.porno]);
    t.life = new Cards([ganparacard.redlife]);

    p.stealX(t, 2);

    expect(p.handNum()).toEqual(1);
    expect(t.handNum()).toEqual(2);
  });

  it('即死X(機能確認)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const t = new GPlayer('target', '0000', messengerLocal, messengerGloval);
    t.hand = new Cards([ganparacard.gangster, ganparacard.money]);
    t.life = new Cards([ganparacard.redlife]);
    const m = new Cards();

    p.suddenDeathX(t, 3, m);

    console.log(t.toString());
    expect(p.handNum()).toEqual(0);
    expect(t.handNum()).toEqual(0);
    expect(t.front.number()).toEqual(1);
    expect(m.number()).toEqual(2);
  });

  it('即死X(超過した枚数)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const t = new GPlayer('target', '0000', messengerLocal, messengerGloval);
    t.hand = new Cards([ganparacard.gangster, ganparacard.money]);
    t.life = new Cards([ganparacard.redlife]);
    const m = new Cards();

    p.suddenDeathX(t, 4, m);

    console.log(t.toString());
    expect(p.handNum()).toEqual(0);
    expect(t.handNum()).toEqual(0);
    expect(t.front.number()).toEqual(1);
    expect(m.number()).toEqual(2);
  });

  it('即死X(バックのあるカード)', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    const t = new GPlayer('target', '0000', messengerLocal, messengerGloval);
    t.hand = new Cards([ganparacard.gangster, ganparacard.porno]);
    t.life = new Cards([ganparacard.redlife]);
    const m = new Cards();

    p.suddenDeathX(t, 3, m);

    console.log(t.toString());
    expect(p.handNum()).toEqual(0);
    expect(t.handNum()).toEqual(1);
    expect(t.front.number()).toEqual(1);
    expect(m.number()).toEqual(1);
  });

  it('toString', function() {
    const messengerGloval = {send: sinon.spy()};
    const messengerLocal = {send: sinon.spy()};
    const p = new GPlayer(pname, id, messengerLocal, messengerGloval);
    p.life.putOn('REDLIFE');
    p.hand = new Cards([1, 2, 3, 4, 5]);
    p.front = new Cards([6, 7]);
    console.log(p.toString());
  });
});
