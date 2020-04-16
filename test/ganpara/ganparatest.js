const Ganpara = require('../../ganpara/ganpara.js');
const Cards = require('../../cardbase/cards.js');
const GCard = require('../../ganpara/ganparacard.js');
const deck = require('../../ganpara/deck_consumer.js').comsumer;

const expect = require('expect');

const players = ['MoneyJ', 'Dayday', 'Caralina', 'Maria', 'Drop', 'Kirisato'];

describe('クラス機能チェック(ganpara)', function() {
  it('コンストラクタ', function() {
    const gp = new Ganpara();
    gp.setup(
        players,
        deck.lifesIn,
        deck.lifesOpt,
        deck.startHands,
        deck.startMarket,
        deck.deck,
    );
    gp.players.forEach((p, i)=>{
      expect(p.hand).toBeInstanceOf(Cards);
      expect(p.hand.number()).toEqual(6);
      for (const c of p.hand.cs) {
        expect(c).toBeInstanceOf(GCard);
      }
      expect(p.life).toBeInstanceOf(Cards);
      expect(p.life.number()).toEqual(1);
      expect(p.life.cs[0]).toBeInstanceOf(GCard);
      expect(p.name).toEqual(players[i]);
      expect(p.front.number()).toEqual(0);
      expect(p.isLive).toBe(true);
      expect(p.isLifeOpened).toBe(false);
    });
  });
});
