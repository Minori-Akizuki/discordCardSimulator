module.exports = class Rand {
  /**
   * 乱数の初期化を行う。
   * @param {Number} seed 種
   */
  constructor(seed) {
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = seed || Date.now();
    // 100回ぐらい回す
    for (let i=0; i<100; i++) {
      this.next();
    }
  }

  /**
   * 乱数を送る
   * @return {Number} rand
   */
  next() {
    const t =this.x ^ (this.x << 11);
    this.x = this.y; this.y = this.z; this.z = this.w;
    return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
  }

  /**
   * 1-mのダイスロール
   * @param {Number} m 最大値
   * @return {Number}
   */
  dice(m) {
    return Math.abs(this.next()) % m + 1;
  }

  /**
   * nDmをする
   * @param {Number} n ダイス数
   * @param {Number} m ダイス種別
   * @return {Number} ダイス結果
   */
  nDm(n, m) {
    let ans = 0;
    for (let t=1; t<=n; t++) {
      ans += this.dice(m);
    }
    return ans;
  }

  /**
   * 1からmaxまでの重複のない整数乱数を生成する
   * @param {*} max 最大値
   * @param {*} number 個数
   * @return {[Number]} 採択結果
   */
  nonOverlappingRand(max, number) {
    if (number < max) return [];
    const ans = [];
    for (let n=1; n <= number; ) {
      const b = this.dice(max);
      if (ans.findIndex((x)=>x==b)==-1) {
        ans.push(b);
        n++;
      }
    }
    return ans;
  }

  /**
   * 指定配列の中から1個採択する
   * @param {[any]} xs 採択内容
   * @return {any} 採択結果
   */
  choice(xs) {
    return xs[this.dice(xs.length)-1];
  }

  /**
   * 指定配列の中からn個採択する。
   * @param {[any]} xs 採択内容
   * @param {Number} n 採択個数
   * @return {[any]} 採択結果
   */
  choiceN(xs, n) {
    if (xs.length < n) return [];
    //
    const choicedIndex = this.nonOverlappingRand(xs.length, n);
    const choicedX = [];
    for (const i of choicedIndex) {
      choicedX.push(xs[i-1]);
    }
    return choicedX;
  }

  /**
   * 配列の中身をコピーしシャッフルする
   * @param {[any]} xs
   * @return {[any]} シャッフルされた配列
   */
  shaffle(xs) {
    return this.choiceN(xs, xs.length);
  }
};
