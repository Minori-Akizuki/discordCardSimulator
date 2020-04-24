const Ganpara = require('../../ganpara/ganpara.js');
const Cards = require('../../cardbase/cards.js');
const GCard = require('../../ganpara/ganparacard.js');
const deck = require('./testdeck.js').test();
const porno = new GCard({
  nameE: 'PORNO',
  nameJ: 'ポルノ',
  kind: 'CONTRABAND CARD',
  cost: '2', text: '【摘発対象】【制限1】【公開1】MONEY2枚を拾う、手に入れたターンは使用できない',
  back: 'PORNO',
});

const expect = require('expect');
const messenger = function(name) {
  return {
    send: function(m) {
      console.log(`${m} -> ${name}`);
    },
  };
};

const players = [
  {name: 'MoneyJ', messenger: messenger('MoneyJ'), id: '1'},
  {name: 'Dayday', messenger: messenger('Dayday'), id: '2'},
//  {name: 'Caralina', messenger: messenger('Caralina'), id: '3'},
//  {name: 'Maria', messenger: messenger('Maria'), id: '4'},
//  {name: 'Drop', messenger: messenger('Drop'), id: '5'},
//  {name: 'Kirisato', messenger: messenger('Kirisato'), id: '6'},
];

describe('クラス機能チェック(ganpara)', function() {
  it('コンストラクタ/セットアップ', function() {
    const gp = new Ganpara(messenger('gloval'));
    gp.setup(
        players,
        deck,
    );
    gp.deck.putOn(porno);
    gp.roundTurn();
    console.log(gp.playerFromId('1').toString());
    console.log(gp.playerFromId('1').hand.toString());
    console.log(gp.playerFromId('2').hand.toString());
  });
});
