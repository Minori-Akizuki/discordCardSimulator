const Cards = require('../cardbase/cards.js');
const GCard = require('./ganparacard.js');
const GPlayer = require('./ganparaplayer');
const Randomizer = require('../cardbase/randomizer.js');

const deckKind = {
  LIFES_IN: 'lifesIn',
  LIFES_OPT: 'lifesOpt',
  GSS: 'gangsters',
  MONEYS: 'moneys',
  BULLETS: 'bullets',
  SPS: 'specialists',
  WEAPONS: 'weapons',
  ST_MKT: 'startMarket',
  NO_HANDS: 'noHands',
};

module.exports = class ganpara {
  /**
   * @constructor
   * @param {IMessenger} messengerGloval 通知用メッセンジャー
   */
  constructor(messengerGloval) {
    this.messengerGloval = messengerGloval;
    this.rnd = new Randomizer();
    this.playerNum = null;
    this.players = [];
    this.turnPlayerNum = 0;
    this.startPlayer = 0;
    this.roundNum = 1;
    this.market = new Cards();
    this.deck = new Cards();
    this.inited = false;
    this.deckName = 'consumer';
  }

  /**
   * IDからプレイヤーを返す
   * @param {String} id id
   * @return {GPlayer} プレイヤー
   */
  playerFromId(id) {
    const index = this.players.findIndex((x)=>x.id==id);
    if (index == -1) return -1;
    return this.players[index];
  }

  /**
   * プレイヤー番号からプレイヤーを返す
   * @param {Number} number
   * @return {GPayer} player
   */
  playerFromNumber(number) {
    return this.players[number-1];
  }

  /**
   * スタピーを決定する
   * @param {Number} id
   */
  setStartPlayerFromId(id) {
    const index = this.players.findIndex((x)=>x.id==id);
    this.startPlayer = index;
    this.turnPlayerNum = index;
  }
  /**
   * ターンプレイヤーを返す
   * @return {GPlayer} turn player
   */
  turnPlayer() {
    return this.players[this.turnPlayerNum];
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
    deckTo.drawFrom(deckFrom, deckFrom.number() - number);
  }

  /**
   * デッキ種別(.deck)でフィルタリングをする
   * @param {[any]} cards
   * @param {[any]} deckKind
   * @return {[any]}
   */
  filterDeck(cards, deckKind) {
    if (!deckKind) return cards.filter((c)=>!c.deck||c.deck=='');
    return cards.filter((c)=>c.deck == deckKind);
  }

  /**
   * デッキ種別でフィルタされたGCardのデッキを作成する
   * @param {[any]} _deck 全デッキ
   * @param {String} _deckKind カード種別
   * @return {Cards}
   */
  initGCards(_deck, _deckKind) {
    return new Cards(this.filterDeck(_deck, _deckKind).map((c)=> new GCard(c)));
  }

  /**
   * デッキを仕分けする。
   * @param {[Cards]} _deck
   * @return {Object}
   */
  sepaleteDeck(_deck) {
    const deck = {};
    deck.lifesIn = this.initGCards(_deck, deckKind.LIFES_IN);
    deck.lifesOpt = this.initGCards(_deck, deckKind.LIFES_OPT);
    deck.gangsters = this.initGCards(_deck, deckKind.GSS);
    deck.moneys = this.initGCards(_deck, deckKind.MONEYS);
    deck.bullets = this.initGCards(_deck, deckKind.BULLETS);
    deck.specialists = this.initGCards(_deck, deckKind.SPS);
    deck.weapons = this.initGCards(_deck, deckKind.WEAPONS);
    deck.startMarket = this.initGCards(_deck, deckKind.ST_MKT);
    deck.noHands = this.initGCards(_deck, deckKind.NO_HANDS);
    deck.others = this.initGCards(_deck);
    return deck;
  }

  /**
     * ゲームセットアップ
     * @param {[Object]} players プレイヤー
     * @param {[Cards]} _deck デッキ
     */
  setup(players, _deck) {
    this.messengerGloval.send('ゲームを初期化します');
    // カード捨て場
    const trash = new Cards();
    // convert
    const lifesIn = this.initGCards(_deck, deckKind.LIFES_IN);
    const lifesOpt = this.initGCards(_deck, deckKind.LIFES_OPT);
    const gangsters = this.initGCards(_deck, deckKind.GSS);
    const moneys = this.initGCards(_deck, deckKind.MONEYS);
    const bullets = this.initGCards(_deck, deckKind.BULLETS);
    const specialists = this.initGCards(_deck, deckKind.SPS);
    const weapons = this.initGCards(_deck, deckKind.WEAPONS);
    const startMarket = this.initGCards(_deck, deckKind.ST_MKT);
    const noHands = this.initGCards(_deck, deckKind.NO_HANDS);
    const deck = this.initGCards(_deck);

    // count player
    this.playerNum = players.length;
    // setup life
    lifesOpt.shaffle();
    const needLifeNum = this.playerNum - lifesIn.number();
    lifesIn.drawFrom(lifesOpt, needLifeNum);
    lifesIn.shaffle();
    console.log(lifesIn);
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
      this.adjustCard(d, deck, this.playerNum);
    }

    // 一度デッキをシャッフル
    deck.shaffle();

    // プレイヤーに手札を配る
    this.players = [];
    for (let i=0; i<this.playerNum; i++) {
      this.players.push(new GPlayer(players[i].name, players[i].id, players[i].messenger, this.messengerGloval));

      // 弾丸、ギャングスター、お金、2スペ、武器を配る
      for (const d of [bullets, gangsters, moneys, specialists, weapons]) {
        this.players[i].hand.drawFrom(d, 1);
      }
      // 乱1を配る。デッキトップにバックの無いカードが出るまでシャッフルを続けてから配る。
      this.players[i].hand.drawWithNoBackFrom(deck, 1);

      this.players[i].life.drawFrom(lifesIn, 1);
      this.players[i].sortHand();
    }

    // 乱1に入らないカード類を追加
    deck.putOn(noHands);
    // バックのあるカードがボトムにいるかもしれないのでもう一度デッキをシャッフル
    deck.shaffle();

    // プレイヤーの順番をシャッフル
    this.players = this.rnd.shaffle(this.players);

    // 初期場の開示
    this.deck = deck;
    this.market = startMarket;
    startMarket.drawFrom(this.deck, 3);

    this.inited = true;

    // 手札の通知
    console.log(this.players);
    this.players.forEach(function(p) {
      console.log(p);
      p.checkHand();
    });
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
    if (this.turnPlayerNum == this.startPlayer) {
      this.roundNum++;
    }
    this.messengerGloval.send(`${this.roundNum}ラウンド目、ターンプレイヤーは${this.turnPlayer().name}です。`);
    if (this.roundNum == 0 && this.turnPlayerNum == (this.startPlayer + this.playerNum - 1)%this.playerNum) {
      this.messengerGloval.send('** 喪が明けました! **');
    }
    this.messengerGloval.send(this.toString());
  }

  /**
   * toString
   * @return {String}
   */
  toString() {
    if (!this.inited) {
      return `not inited (${this.deckName})`;
    }
    const round = `--- ${this.roundNum} ラウンド目 ---`;
    const decknum = `* deck (${this.deckName}) : ${this.deck.number()}`;
    const decktop = '* deckTop : ' + (this.deck.peepTop().back ? this.deck.peepTop().back : '■');
    const market = '* market :\n' + this.market.toString();
    const _players = [];
    this.players.forEach(function(p, i) {
      _players.push(`${i+1} : ${p.toString()}`);
    });
    const players = _players.join('\n');
    const turnPlayer = `Turn player is ${this.players[this.turnPlayerNum].name}`;
    return [round, decknum, decktop, market, players, turnPlayer].join('\n \n');
  }
};
