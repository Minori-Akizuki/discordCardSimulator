const Cards = require('../cardbase/cards.js');

module.exports = class player {
  /**
     * @constructor
     * @param {String} name プレイヤー名
     */
  constructor(name) {
    this.name = name;
    this.life = new Cards();
    this.opendLife = null;
    this.hand = new Cards();
    this.front = new Cards();
    this.isLive = true;
    this.isLifeOpened = false;
  }

  /**
   * 指定カードを手札に入れる
   * @param {Card} cs カード
   */
  addToHand(cs) {
    cs.map((x)=> this.hand.putOn(x));
  }

  /**
   * 手札を表示する
   * @return {String} 手札文字列
   */
  printHandWithLife() {
    return this.hand.toString() + '\nLIFE: ' + this.life.toString();
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
   * 任意のカードを捨てる。
   * @param {Number} n 指定カードナンバー
   * @param {Cards} market 場
   */
  trashHand(n, market) {
    market.putOn(c);
  }

  /**
   * ライフを捨てる
   */
  trashLife() {
    const l = this.life.pick(1);
    this.front.putOn(c);
  }

  /**
   * ライフを開ける(手札には残ったまま)
   */
  openLife() {
    this.opendLife = this.life.peepTop(1);
    this.isLifeOpened = true;
  }

  /**
   * 手札を1枚文字列で公開する
   * @param {Number} n 指定カードナンバー
   * @return {String} カード文字列
   */
  openHand(n) {
    return n + ' : ' + this.hand.cs[n-1].toString();
  }

  /**
   * 手札(LIFE以外)を全て文字列として返す
   * @return {String} カード文字列
   */
  openHandAll() {
    return this.hand.toString();
  }

  /**
   * 手札枚数
   * @return {Number}
   */
  handNum() {
    return this.hand.number() + this.life.number();
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
