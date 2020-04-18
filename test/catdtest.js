const Cards = require('../cardbase/cards.js');
const expect = require('expect');

const simpleCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const getSortedSimpleCards = function() {
  return simpleCards.concat();
};

describe('クラス機能チェック(Card)', function() {
  it('初期化(データあり)', function() {
    const deck = new Cards(simpleCards);
    expect(deck.cs).toEqual(simpleCards);
  });

  it('初期化(データなし)', function() {
    const deck = new Cards();
    expect(deck.cs).toEqual([]);
  });

  it('枚数確認', function() {
    const deck = new Cards(simpleCards);
    expect(deck.number()).toEqual(simpleCards.length);
  });

  it('シャッフル', function() {
    const deck = new Cards(getSortedSimpleCards());
    deck.shaffle();
    // 内容量がかわらない
    expect(deck.cs).toHaveLength(simpleCards.length);
    // 元の内容が全て含まれている
    expect(deck.cs).toEqual(expect.arrayContaining(simpleCards));
    // もういっかいシャッフルしたら内容が変わる
    // (1/10! の確率で失敗するけど……)
    const _cp = deck.cs.concat();
    deck.shaffle();
    expect(deck.cs).not.toEqual(_cp);
  });

  it('ドロー', function() {
    const deck = new Cards(getSortedSimpleCards());
    const c = deck.pickTop();
    // デッキが1枚減ってる
    expect(deck.cs).toHaveLength(simpleCards.length -1);
    // トップが引かれてる
    expect(c).toEqual(1);
    // その他のカードそのままが残っている
    expect(deck.cs).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('抜く(まんなか)', function() {
    const deck = new Cards(getSortedSimpleCards());
    const c = deck.pick(5);
    expect(c).toEqual(5);
    expect(deck.cs).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 10]);
  });

  it('トップに戻す', function() {
    const deck = new Cards(getSortedSimpleCards());
    deck.putOn(99);
    // デッキが1枚増えてる
    expect(deck.cs).toHaveLength(simpleCards.length +1);
    // 元の内容が全て含まれている
    expect(deck.cs).toEqual(expect.arrayContaining(simpleCards));
    // デッキトップにさっきのカードがいる
    expect(deck.cs[0]).toEqual(99);
  });

  it('ボトムに戻す', function() {
    const deck = new Cards(getSortedSimpleCards());
    deck.putUnder(99);
    // デッキが1枚増えてる
    expect(deck.cs).toHaveLength(simpleCards.length +1);
    // 元の内容が全て含まれている
    expect(deck.cs).toEqual(expect.arrayContaining(simpleCards));
    // デッキトップにさっきのカードがいる
    expect(deck.cs[deck.cs.length-1]).toEqual(99);
  });

  it('デッキトップのピープ(1)', function() {
    const deck = new Cards(getSortedSimpleCards());
    // 1枚ピーピング
    const c = deck.peep(1);
    // ピーピング結果が1である
    expect(c).toEqual(expect.arrayContaining([1]));
    // 内容量がかわらない
    expect(deck.cs).toHaveLength(simpleCards.length);
    // 元の内容が全て含まれている
    expect(deck.cs).toEqual(expect.arrayContaining(simpleCards));
  });

  it('デッキトップのピープ(0)', function() {
    const deck = new Cards(getSortedSimpleCards());
    // 0枚ピーピング
    const c = deck.peep(0);
    // ピーピング結果がない
    expect(c).toEqual([]);
    // 内容量がかわらない
    expect(deck.cs).toHaveLength(simpleCards.length);
    // 元の内容が全て含まれている
    expect(deck.cs).toEqual(expect.arrayContaining(simpleCards));
  });

  it('デッキトップのピープ(5)', function() {
    const deck = new Cards(getSortedSimpleCards());
    // 5枚ピーピング
    const c = deck.peep(5);
    // ピーピング結果が5まで
    expect(c).toEqual([1, 2, 3, 4, 5]);
    // 内容量がかわらない
    expect(deck.cs).toHaveLength(simpleCards.length);
    // 元の内容が全て含まれている
    expect(deck.cs).toEqual(expect.arrayContaining(simpleCards));
  });

  it('デッキトップのピープ(10)', function() {
    const deck = new Cards(getSortedSimpleCards());
    // 10枚ピーピング
    const c = deck.peep(10);
    // ピーピング結果が全て
    expect(c).toEqual(simpleCards);
    // 内容量がかわらない
    expect(deck.cs).toHaveLength(simpleCards.length);
    // 元の内容が全て含まれている
    expect(deck.cs).toEqual(expect.arrayContaining(simpleCards));
  });

  it('デッキトップのピープ(11)', function() {
    const deck = new Cards(getSortedSimpleCards());
    // 11枚ピーピング
    const c = deck.peep(10);
    // ピーピング結果が全て
    expect(c).toEqual(simpleCards);
    // 内容量がかわらない
    expect(deck.cs).toHaveLength(simpleCards.length);
    // 元の内容が全て含まれている
    expect(deck.cs).toEqual(expect.arrayContaining(simpleCards));
  });

  it('カードの移動', function() {
    const deckfrom = new Cards(getSortedSimpleCards());
    const deckto = new Cards(getSortedSimpleCards());
    deckfrom.moveTo(deckto, 3);
    expect(deckfrom.cs).toEqual([1, 2, 4, 5, 6, 7, 8, 9, 10]);
    expect(deckto.cs).toEqual([3, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('カードのドロー(1)', function() {
    const deckfrom = new Cards(getSortedSimpleCards());
    const deckto = new Cards(getSortedSimpleCards());
    deckto.drawFrom(deckfrom, 1);
    expect(deckfrom.cs).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(deckto.cs).toEqual([1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('toString', function() {
    const deck = new Cards(['hoge', 'huga']);
    expect(deck.toString()).toEqual('1 : hoge\n2 : huga');
  });
},
);
