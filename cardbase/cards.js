/**
 * カードの束
 */
module.exports = class Cards {
  /**
     * コンストラクタ
     * @constructor
     * @param {Array} cards 初期カード
     */
  constructor(cards) {
    this.cs = cards ? cards.concat() : [];
  }

  /**
     * カード枚数
     * @return {Number} カード枚数
     */
  number() {
    return this.cs.length;
  }

  /**
     * カードシャッフル
     */
  shaffle() {
    for (let i = this.cs.length-1; i>=0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [this.cs[i], this.cs[j]] = [this.cs[j], this.cs[i]];
    }
  }

  /**
     * カードのソート
     * @param {function} sortOf ソート関数
     */
  sort(sortOf) {
    if (!sortOf) return;
    this.cs.sortOf(sortOf);
  }
  /**
     * 上から1枚引く
     * @param {Number} n 枚数
     * @return {card} 引いたカード
     */
  pickTop() {
    return this.cs.shift();
  }

  /**
     * 任意の位置のカードを抜く
     * @param {Number} n
     * @return {[card]}
     */
  pick(n) {
    const cs = this.cs.splice(n-1, 1);
    return cs[0];
  }

  /**
     * 上にのせる
     * @param {any} card
     */
  putOn(card) {
    this.cs.unshift(card);
  }

  /**
     * 下に置く
     * @param {any} card
     */
  putUnder(card) {
    this.cs.push(card);
  }

  /**
     * 上から数枚見る
     * @param {Number} n
     * @return {[any]}
     */
  peepTop(n) {
    const peep = [];
    for (let i=0; i < n && i < this.cs.length; i++) {
      peep.push(this.cs[i]);
    }
    return peep;
  }

  /**
     * 指定カードを移動させる
     * @param {Cards} to 移動先
     * @param {Number} n 指定番号
     */
  moveTo(to, n) {
    if (n > this.cs.length) throw new Error('not enough card');
    const c = this.pick(n);
    to.putOn(c);
  }

  /**
     * 領域からカードを引く
     * @param {Cards} from 引くデッキ
     * @param {Number} n 枚数
     */
  drawFrom(from, n) {
    for (let i=0; i<n; i++) {
      const c = from.pickTop();
      this.putOn(c);
    }
  }

  /**
   * toString
   * @return {String}
   */
  toString() {
    return this.cs.map((x, i)=>{
      return (i+1) + ' : ' + x.toString();
    }).join('\n');
  }
};
