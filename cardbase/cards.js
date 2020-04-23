const Randomizer = require('./randomizer.js');

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
    this.rnd = new Randomizer();
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
  * @return {Cards} this
  */
  shaffle() {
    for (let i = this.cs.length-1; i>=0; i--) {
      const j = this.rnd.dice(i+1)-1;
      [this.cs[i], this.cs[j]] = [this.cs[j], this.cs[i]];
    }
    return this;
  }

  /**
     * カードのソート
     * @param {function} sortOf ソート関数
     */
  sort(sortOf) {
    if (!sortOf) return;
    this.cs.sort(sortOf);
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
   * @return {card}
   */
  pick(n) {
    const cs = this.cs.splice(n-1, 1);
    return cs[0];
  }

  /**
   * 複数枚指定してそれらのカードを抜き出す
   * @param  {...Number} ns
   * @return {Cards}
   */
  picks(...ns) {
    const _this = this;
    const ps = [];
    ns.forEach(function(n) {
      if (n <= _this.cs.length && _this.cs[n-1]) {
        ps.push(_this.cs[n-1]);
        _this.cs[n-1] = null;
      }
    });
    this.cs = this.cs.filter((c)=>!!c);
    return new Cards(ps);
  }

  /**
     * カードかデッキを上にのせる
     * @param {any} card
     */
  putOn(card) {
    if (card instanceof Cards) {
      this.cs = card.cs.concat(this.cs);
      card.cs = [];
      return;
    }
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
     * 上から1枚見る
     * @return {any}
     */
  peepTop() {
    return this.peep(1)[0];
  }

  /**
   * 上から数枚枚見る
   * @param {Number} n 枚数
   * @return {[any]}
   */
  peep(n) {
    const peep = [];
    for (let i=0; i < n && i < this.cs.length; i++) {
      peep.push(this.cs[i]);
    }
    return peep;
  }

  /**
   * 指定番号のカードを見る
   * @param {Number} n カード番号
   * @return {Card} カード情報
   */
  peepN(n) {
    if (this.cs.length < n) return null;
    return this.cs[n-1];
  }

  /**
   * 複数指定して全てpeepする
   * @param  {...any} ns 指定番号
   * @return {Cards}
   */
  peeps(...ns) {
    const _this = this;
    const ps = [];
    ns.forEach(function(n) {
      ps.push(_this.cs[n-1]);
    });
    return new Cards(ps);
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
   * 領域からカードを引く、この時バックのあるカードは一度ボトムに置く。
   * @param {Cards} from 引くデッキ
   * @param {Number} n 枚数
   */
  drawWithNoBackFrom(from, n) {
    for (let i=0; i<n; i++) {
      while (from.peepTop().back) {
        from.putUnder(from.pickTop());
      }
      this.drawFrom(from, 1);
    }
  }

  /**
   * このデッキをコピー
   * @return {Cards} このデッキのコピー
   */
  copy() {
    return new Cards(this.cs.concat());
  }

  /**
   * デッキ内の特定カードを抽出する。
   * 条件外のカードは廃棄される
   * @param {Function} f 条件
   * @return {Cards} このオブジェクト
   */
  filter(f) {
    this.cs = this.cs.filter(f);
    return this;
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
