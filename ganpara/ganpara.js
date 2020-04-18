const Cards = require('../cardbase/cards.js');
const GCard = require('./ganparacard.js');
const GPlayer = require('./ganparaplayer');
const Randomizer = require('../cardbase/randomizer.js');

module.exports = class ganpara {
  /**
   * @constructor
   * @param {IMessenger} messengreGloval 通知用メッセンジャー
   */
  constructor(messengreGloval) {
    this.messengreGloval = messengreGloval;
    this.rnd = new Randomizer();
    this.playerNum = null;
    this.players = [];
    this.turnPlayerNum = 0;
    this.market = new Cards();
    this.deck = new Cards();
    this.inited = false;
  }

  /**
   * カードを名前指定で抜きとる
   * @param {Cards} cards 対象のデッキ
   * @param {String} nameE カード名
   * @return {Card} 抜いたカード
   */
  pickCardByNameE(cards, nameE) {
    const index = cards.cs.findIndex((x)=>x.nameE==nameE);
    const c = cards.pick(index+1);
    return c;
  }

  /**
   * カードの枚数を調整する。
   * @param {Cards} deckFrom 調整対象
   * @param {Cards} deckTo 抜いたカードの行きさき
   * @param {Number} number 目標枚数
   */
  adjustCard(deckFrom, deckTo, number) {
    deckTo.drawFrom(deckFrom, deckFrom.number - number);
  }

  /**
     * ゲームセットアップ
     * _startHands の中身
     *  .gangstars
     *  .moneys
     *  .bullets
     *  .specialists
     *  .weapons
     * 余ったカードはデッキに入ります。
     * @param {[Object]} players プレイヤー
     * @param {[Card]} _lifesIn 確定ライフ
     * @param {[Card]} _lifesOpt 欠けありライフ
     * @param {Object} _startHands 初期手札に入るカード
     * @param {[Card]} _startMarket 初期場
     * @param {[Cards]} _deck その他のカード
     */
  setup(players, _lifesIn, _lifesOpt, _startHands, _startMarket, _deck) {
    // カード捨て場
    const trash = new Cards();
    // convert
    const lifesIn = new Cards(_lifesIn.map((x)=> new GCard(x)));
    const lifesOpt = new Cards(_lifesOpt.map((x)=> new GCard(x)));
    const gangsters = new Cards(_startHands.gangsters.map((x)=> new GCard(x)));
    const moneys = new Cards(_startHands.moneys.map((x)=> new GCard(x)));
    const bullets = new Cards(_startHands.bullets.map((x)=> new GCard(x)));
    const specialists = new Cards(_startHands.specialists.map((x)=> new GCard(x)));
    const weapons = new Cards(_startHands.weapons.map((x)=> new GCard(x)));
    const startMarket = new Cards(_startMarket.map((x)=> new GCard(x)));
    const deck = new Cards(_deck.map((x)=> new GCard(x)));

    // count player
    this.playerNum = players.length;
    // setup life
    lifesOpt.shaffle();
    const needLifeNum = this.playerNum - lifesIn.number();
    lifesIn.drawFrom(lifesOpt, needLifeNum);
    lifesIn.shaffle();

    // setup bullets
    // これだけ(弾丸の)カードを抜いてからシャッフルする
    this.adjustCard(bullets, trash, this.playerNum);
    bullets.shaffle();

    // 余ったら除けられるやつ
    for (const d of [gangsters, moneys]) {
      d.shaffle();
      this.adjustCard(d, trash, this.playerNum);
    }

    // 余ったらデッキにもどるやつ
    for (const d of [specialists, weapons] ) {
      d.shaffle();
      this.adjustCard(d, trash, this.playerNum);
    }

    // 一度デッキをシャッフル
    deck.shaffle();

    // プレイヤーに手札を配る
    this.players = [];
    for (let i=0; i<this.playerNum; i++) {
      this.players.push(new GPlayer(players.name, players.messenger, this.messengreGloval));
      this.players[i].name = players[i].name;
      this.players[i].hand = new Cards();
      for (const d of [bullets, gangsters, moneys, specialists, weapons, deck]) {
        this.players[i].hand.drawFrom(d, 1);
      }
      this.players[i].life.drawFrom(lifesIn, 1);
      console.log(this.players[i].name);
      console.log(this.players[i].hand.toString());
      console.log(this.players[i].life.toString());
    }

    // プレイヤーの順番をシャッフル
    this.players = this.rnd.shaffle(this.players);

    // 初期場の開示
    this.market = startMarket;
    startMarket.drawFrom(deck, 3);
    this.inited = true;
    console.log(this.toString());
  }

  /**
   * ターンプレイヤー
   * @return {GPlayer} ターンプレイヤー
   */
  turnPlayer() {
    return this.players[this.turnPlayerNum];
  }
  /**
   * ターンを回す
   */
  roundTurn() {
    this.turnPlayerNum = ++this.turnPlayerNum % this.playerNum;
    this.messengreGloval.send(`ターンプレイヤーは${this.turnPlayer().name}です。`);
  }

  /**
   * toString
   * @return {String}
   */
  toString() {
    if (!this.inited) {
      return 'not inited';
    }
    const decknum = '* deck : ' + this.deck.number();
    const market = '* market :\n' + this.market.toString();
    const players = this.players.map((x)=>{
      return `${x.toString()}`;
    }).join('\n');
    const turnPlayer = `Turn player is ${this.players[this.turnPlayerNum].name}`;
    return [decknum, market, players, turnPlayer].join('\n');
  }
};
