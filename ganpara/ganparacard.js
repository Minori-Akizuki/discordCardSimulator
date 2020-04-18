module.exports = class card {
  /**
     * カード作成<br/>
     * <ul>
     * <li> cardStatus.nameJ : 和名
     * <li> cardStatus.mameE : 英名
     * <li> cardStatus.kind : 種別
     * <li> cardStatus.cost : コスト
     * <li> cardStatus.text : テキスト
     * <ul>
     * @constructor
     * @param {Object} cardStatus カード情報
     */
  constructor(cardStatus) {
    this.nameJ = cardStatus.nameJ;
    this.nameE = cardStatus.nameE;
    this.kind = cardStatus.kind;
    this.cost = cardStatus.cost;
    this.text = cardStatus.text;
    this.back = cardStatus.back ? cardStatus.back : null;
    this.isLife = !!cardStatus.isLife;
  }

  /**
   * このカードをソートするための関数
   * @param {card} a
   * @param {card} b
   * @return {Number}
   */
  static conpare(a, b) {
    const stra = a.toString();
    const strb = b.toString();
    if (stra<strb) return -1;
    if (stra>strb) return 1;
    return 0;
  }

  /**
   * カードの背面
   * @return {String} 背面になにかあればそれ、そうでなければ■
   */
  showBack() {
    return this.back ? this.back : '■';
  }

  /**
   * カード詳細表示
   * @return {String} 詳細情報
   */
  showDetail() {
    return `【${this.kind}】【${this.nameE}】 -${this.nameJ}- (${this.cost}) : ${this.text}`;
  }

  /**
   * toSrtimg
   * @return {String} カード情報
   */
  toString() {
    return `【${this.kind}】【${this.nameE}】 (${this.cost})`;
  }
};
