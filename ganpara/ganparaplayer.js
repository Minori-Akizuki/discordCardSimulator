const Cards = require('../cardbase/cards.js');
const Randomizer = require('../cardbase/randomizer');
const GCard = require('./ganparacard');

module.exports = class player {
  /**
     * @constructor
     * @param {String} name プレイヤー名
     * @param {IMessenger} messengerOwn 自身への通知先
     * @param {IMessenger} messengerGloval 全体通知先
     */
  constructor(name, messengerOwn, messengerGloval) {
    this.name = name;
    this.messengerGloval = messengerGloval;
    this.messengerOwn = messengerOwn;
    this.life = new Cards();
    this.opendLife = null;
    this.hand = new Cards();
    this.front = new Cards();
    this.isLive = true;
    this.isLifeOpened = false;
    this.rnd = new Randomizer();
  }

  /**
   * 手札枚数
   * @return {Number}
   */
  handNum() {
    return this.hand.number() + this.life.number();
  }

  /**
   * 指定カードを手札に入れる
   * @param {[Card]} cs カード
   */
  addToHand(cs) {
    cs.map((x)=> this.hand.putOn(x));
  }

  /**
   * 手札を表示する
   * @return {String} 手札文字列
   */
  printHandWithLife() {
    const hand = this.hand.toString() + '\nLIFE: ' + this.life.toString();
    this.messengerOwn.send( hand );
    return hand;
  }

  /**
   * カードを1枚前に置く
   * @param {Number} n 指定カードナンバー
   */
  putCardFront(n) {
    const c = this.hand.pick(n);
    this.front.putOn(c);
  }

  /**
   * 前に置いてあるカードを手札に戻す
   * @param {Number} n 指定カードナンバー
   */
  pickCardFront(n) {
    const c = this.front.pick(n);
    this.hand.putOn(c);
  }

  /**
   * 任意のカードを捨てる。もしライフだった場合は自身の前に置く。
   * @param {Number} n 指定カードナンバー
   * @param {Cards} market 場
   */
  trashHand(n, market) {
    const c = this.hand.pick(n);
    if (!c) return;
    if (c.isLife) {
      this.front.putOn(c);
    } else {
      market.putOn(c);
    }
  }

  /**
   * ライフを捨てる
   */
  trashLife() {
    const l = this.life.pick(1);
    this.front.putOn(l);
  }

  /**
   * 手札をソートする
   */
  sortHand() {
    this.hand.cs.sort(GCard.conpare);
  }

  /**
   * 手札に入っているライフを分ける
   */
  divideLife() {
    const i = this.hand.cs.findIndex((x)=>x.isLife);
    if (i == -1) return;
    this.life.putOn(this.hand.pick(i+1));
  }
  /**
   * ライフを開ける(手札には残ったまま)
   */
  openLife() {
    this.opendLife = this.life.peep(1);
    this.isLifeOpened = true;
  }

  /**
   * 手札を1枚文字列で公開する
   * @param {Number} n 指定カードナンバー
   * @return {String} カード文字列
   */
  openHand(n) {
    const str = this.hand.cs[n-1].toString();
    this.messengerGloval.send(str);
    return str;
  }

  /**
   * 手札(LIFE以外)を全て文字列として返す
   * @return {String} カード文字列
   */
  openHandAll() {
    const str = this.hand.toString();
    this.messengerGloval.send(str);
    return str;
  }

  /**
   * カードを引く
   * @param {Cards} deck デッキ
   */
  drawACard(deck) {
    const c = deck.pickTop();
    this.addToHand([c]);
    this.sortHand();
  }

  /**
   * ワンモアドロー処理
   * @param {Cards} deck デッキ
   * @param {Cards} market 場
   */
  oneMoreDraw(deck, market) {
    this.drawACard(deck);
    const c = deck.pickTop();
    this.messengerGloval.send(`${c.toString()}が公開されました`);
    market.putOn(c);
  }

  /**
   * 対象に[確認X]をする
   * このときバックに印のあるカードは対象外になる
   * @param {player} player 対象
   * @param {Number} n 枚数
   * @return {Cards} 引いたカード
   */
  checkX(player, n) {
    const noBack = player.hand.copy().filter((x)=>!x.back);
    noBack.putOn(player.life.copy());
    noBack.shaffle();
    const peepd = new Cards( noBack.peep(n) );
    this.messengerOwn.send(peepd.toString());
    return peepd;
  }

  /**
   * 対象から[奪取X]をする
   * バックに印のあるカードは対象外になる
   * 奪取する枚数よりバックに印が無いカードが少なければとりあえずそれらを取る
   * @param {player} player 対象
   * @param {Number} n 枚数
   */
  stealX(player, n) {
    let _n = n;
    const noBackNum = player.hand.copy().filter((x)=>!x.back).number();
    if (noBackNum < n) {
      _n = noBackNum;
    }
    player.hand.shaffle();
    for (let t=1; t<=_n; ) {
      const c = player.hand.pickTop();
      if (!c.back) {
        this.addToHand([c]);
        t++;
      } else {
        player.hand.putUnder([c]);
      }
    }
    player.sortHand();
  }

  /**
   * 対象に[即死X]をする
   * バックに印のあるカードは除外される。
   * 残ったカードは自身で捨ててもらう
   * @param {player} player 対象
   * @param {Number} n 枚数
   * @param {Cards} market 場
   */
  suddenDeathX(player, n, market) {
    player.hand.putOn(player.life);
    player.hand.shaffle();
    for (let t=1; t<=n && 0 < player.handNum(); t++) {
      if (player.hand.peepTop().back) {
        player.hand.putUnder(player.hand.pickTop());
      } else {
        this.messengerGloval.send(player.hand.peepTop() + 'が捨てられました');
        player.trashHand(1, market);
      }
    }
    player.divideLife();
  }

  /**
   * toString
   * 名前、手札枚数、前のカードを表示
   * @return {String}
   */
  toString() {
    const hand = (this.isLive ? this.isLifeOpened ? this.life.cs[0].toString() : '■ ' : '' ) + this.hand.cs.map((x)=>(x.showBack?x.showBack():'■')).join(' ');
    const front = this.front.toString();
    const live = this.isLive ? 'alive' : 'dead';
    const life = this.opendLife ? `* ${this.opendLife.toString()} * ` : '';
    return `${this.name} ${life}: ${live}\nhand:${hand} (${this.handNum()})\nfront:\n${front}`;
  }
};
