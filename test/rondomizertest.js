const Randomizer = require('../cardbase/randomizer.js');
const expect = require('expect');

const simpleCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const getSortedSimpleCards = function() {
  return simpleCards.concat();
};

describe('クラス機能チェック(Randomizer)', function() {
  const seed = 222;
  it('初期化(データあり)', function() {
    const rnd = new Randomizer(seed);
    // シードを与えているので同じ結果が出るはず
    expect(rnd.next()).toBe(-982224549);
  });

  it('初期化(データなし)', function() {
    const rnd = new Randomizer();
    // シードを与えていないので毎回違う結果が出るはず
    expect(rnd.next()).toEqual(expect.any(Number));
  });

  it('ダイス機能チェック(ランダム性)', function() {
    const rnd = new Randomizer(seed);
    expect(rnd.dice(100)).toEqual(50);
    expect(rnd.dice(100)).toEqual(97);
    expect(rnd.dice(100)).toEqual(19);
    expect(rnd.dice(100)).toEqual(61);
    expect(rnd.dice(100)).toEqual(8);
  });

  it('ダイス機能チェック(3d6)', function() {
    const rnd = new Randomizer(seed);
    expect(rnd.nDm(3, 6)).toEqual(12);
  });

  it('nonOverlappingRand', function() {
    const rnd = new Randomizer();
    const rands = rnd.nonOverlappingRand(3, 3);
    console.log(rands);
  });

  it('shaffle', function() {
    const rnd = new Randomizer();
    const shd = rnd.shaffle(simpleCards);
    console.log(shd);
  });
});
