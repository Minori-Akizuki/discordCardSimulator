const Ganpara = require('../../ganpara/ganpara.js');
const Cards = require('../../cardbase/cards.js');
const GCard = require('../../ganpara/ganparacard.js');
const deck = require('../../ganpara/deck_consumer.js').comsumer;

const expect = require('expect');
const messenger = function(name) {
  return {
    send: function(m) {
      console.log(`${m} -> ${name}`);
    },
  };
};

const players = [
  {name: 'MoneyJ', messenger: messenger('MoneyJ')},
  {name: 'Dayday', messenger: messenger('Dayday')},
  {name: 'Caralina', messenger: messenger('Caralina')},
  {name: 'Maria', messenger: messenger('Maria')},
  {name: 'Drop', messenger: messenger('Drop')},
  {name: 'Kirisato', messenger: messenger('Kirisato')},
];

describe('クラス機能チェック(ganpara)', function() {
  it('コンストラクタ/セットアップ', function() {
    const gp = new Ganpara(messenger('gloval'));
    gp.setup(
        players,
        deck.lifesIn,
        deck.lifesOpt,
        deck.startHands,
        deck.startMarket,
        deck.deck,
    );
    gp.roundTurn();
  });
});
