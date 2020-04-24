const Cards = require('../cardbase/cards.js');
const Randomizer = require('../cardbase/randomizer');
const GCard = require('./ganparacard');

module.exports = class player {
  /**
     * @constructor
     * @param {String} name プレイヤー名
     * @param {String} id ユニーク番号
     * @param {IMessenger} messengerOwn 自身への通知先
     * @param {IMessenger} messengerGloval 全体通知先
     */
  constructor(name, id, messengerOwn, messengerGloval) {
    this.name = name;
    this.id = id;
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
   * 手札を通知する
   */
  checkHand() {
    const handS = this.hand.toString();
    const frontS = this.front.toString();
    const str = ['==========', '手札', handS, this.life.toString(), '前', frontS.toString()].join('\n');
    console.log(str);
    this.messengerOwn.send(str);
  }

  /**
   * 手札をソートし通知する
   */
  sortCards() {
    this.hand.sort(GCard.conpare);
    this.front.sort(GCard.conpare);
    this.checkHand();
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
    this.messengerGloval.send(`${this.name}が${c.toString()}を置きました`);
    this.checkHand();
  }

  /**
   * 前に置いてあるカードを手札に戻す
   * @param {Number} n 指定カードナンバー
   */
  pickCardFront(n) {
    const c = this.front.pick(n);
    this.messengerGloval.send(`${this.name}が前においてある${c.toString()}を拾いました`);
    this.hand.putOn(c);
    this.checkHand();
  }

  /**
   * 場からカードを拾う
   * @param {Number} n
   * @param {Cards} m
   */
  pickCardMarket(n, m) {
    const c = m.pick(n);
    this.messengerGloval.send(`${this.name}が場から${c.toString()}を拾いました`);
    this.hand.putOn(c);
    this.checkHand();
  }

  /**
   * 場からカードを拾う(複数枚)
   * @param {Cards} m マーケット
   * @param {Number} ns
   */
  pickCardsMarket(m, ...ns) {
    const c = m.picks(...ns);
    this.messengerGloval.send(`${this.name}が場から\n${c.toString()}\nを拾いました`);
    this.hand.putOn(c);
    this.checkHand();
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
      this.messengerGloval.send(`${c.toString()}が公開されました`);
    } else {
      market.putOn(c);
      market.sort(GCard.conpare);
      this.messengerGloval.send(`${c.toString()}が場に捨てられました`);
    }
    this.checkHand();
  }

  /**
   * 任意のカードを(複数枚)捨てる。もしライフだった場合は自身の前に置く。
   * @param {Cards} market 場
   * @param {...Number} ns 指定カードナンバー
   */
  trashHands(market, ...ns) {
    const _this = this;
    const cs = this.hand.picks(...ns);
    cs.cs.forEach(function(c) {
      if (!c) return;
      if (c.isLife) {
        _this.front.putOn(c);
        _this.messengerGloval.send(`${c.toString()}が公開されました`);
      } else {
        market.putOn(c);
        market.sort(GCard.conpare);
        _this.messengerGloval.send(`${c.toString()}が場に捨てられました`);
      }
    });
    this.checkHand();
  }

  /**
   * ライフを捨てる
   */
  trashLife() {
    const l = this.life.pick(1);
    this.front.putOn(l);
    this.isLive = false;
    this.messengerGloval.send(`${l.toString()}が捨てられ公開されました`);
    this.checkHand();
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
    this.messengerGloval.send(`${this.name}が${this.opendLife.toString()}を公開しました。`);
    this.isLifeOpened = true;
  }

  /**
   * カードをターゲットに見せる
   * @param {GPlayer} target
   * @param {Number} n
   * @return {String}
   */
  openCardTo(target, n) {
    const c = this.hand.cs[n-1].toString();
    this.messengerOwn.send(`${c}を${target.name}に見せました`);
    target.messengerOwn.send(`${c}を${this.name}から見せられました`);
    return c;
  }

  /**
   *
   * @param {GPlayer} target
   * @param  {...Number} ns
   * @return {String}
   */
  openCardsTo(target, ns) {
    const ps = this.hand.peeps(...ns).toString();
    const msgOwn = `${ps}\nを${target.name}に見せました`;
    this.messengerOwn.send(msgOwn);
    const msgTarget = `${ps}\nを${this.name}から見せられました`;
    target.messengerOwn.send(msgTarget);
    return ps;
  }
  /**
   * 手札を1枚文字列で公開する
   * @param {Number} n 指定カードナンバー
   * @return {String} カード文字列
   */
  openCard(n) {
    const str = this.hand.cs[n-1].toString();
    this.messengerGloval.send(`${this.name}が${str}を公開しました`);
    return str;
  }
  /**
   * 手札を複数枚文字列で公開する
   * @param {Number} n 指定カードナンバー
   * @return {String} カード文字列
   */
  openCards(...ns) {
    const str = this.hand.peeps(...ns).toString();
    this.messengerGloval.send(`${this.name}が\n${str}\nを公開しました`);
    return str;
  }
  /**
   * 手札を全てターゲットに見せる
   * @param {GPlayer} target
   * @return {String}
   */
  openHandTo(target) {
    const str = this.hand.toString();
    target.messengerOwn.send(`${this.name}が\n${str}\nを見せました`);
    this.messengerOwn.send(`${target.name}に\n${str}\nを見せました`);
    return str;
  }

  /**
   * 手札(LIFE以外)を全て文字列として返す
   * @return {String} カード文字列
   */
  openHand() {
    const str = this.hand.toString();
    this.messengerGloval.send(`${this.name}が\n${str}\nを見せました`);
    return str;
  }

  /**
   * 対象にカードを渡す
   * @param {GPlayer} target
   * @param {Number} n
   */
  passACard(target, n) {
    const c = this.hand.pick(n);
    target.addToHand([c]);
    this.messengerGloval.send(`${this.name}が${target.name}にカードを渡しました`);
    this.messengerOwn.send(`${target.name}に${c.toString()}を渡しました`);
    target.messengerOwn.send(`${this.name}から${c.toString()}を貰いました`);
    target.checkHand();
    this.checkHand();
  }

  /**
   * 対象にカードを渡す(複数枚)
   * @param {GPlayer} target
   * @param {...Number} ns
   */
  passCards(target, ...ns) {
    const cs = this.hand.picks(...ns);
    target.addToHand(cs.cs);
    this.messengerGloval.send(`${this.name}が${target.name}にカードを渡しました`);
    this.messengerOwn.send(`${target.name}に\n${cs.toString()}\nを渡しました`);
    target.messengerOwn.send(`${this.name}から\n${cs.toString()}\nを貰いました`);
    target.checkHand();
    this.checkHand();
  }
  /**
   * カードを引く
   * @param {Cards} deck デッキ
   */
  drawACard(deck) {
    const c = deck.pickTop();
    this.addToHand([c]);
    this.sortHand();
    this.messengerGloval.send(`${this.name}がカードを引きました`);
    this.checkHand();
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
   * 場のリセット
   * @param {Cards} m マーケット
   * @param {Cards} d デッキ
   */
  resetMarket(m, d) {
    d.putOn(m);
    d.shaffle();
    m.drawFrom(d, 5);
    m.sort(GCard.conpare);
    this.messengerGloval.send(`${this.name}が場のリセットを行いました。`);
    this.messengerGloval.send('場札 : ');
    this.messengerGloval.send(m.toString());
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
    const peepedtxt = peepd.toString();
    const message =
      `あなたが${player.name}から確認したカードは\n` +
       peepedtxt +
      'です';
    this.messengerOwn.send(message);
    const messaget =
      `あなたが${this.name}から確認されたカードは\n` +
      peepedtxt +
      'です';
    player.messengerOwn.send(messaget);
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
    this.messengerOwn.send(`あなたが${player.name}から奪取したのは`);
    player.messengerOwn.send(`あなたが${this.name}から奪取されたのは`);
    player.hand.shaffle();
    for (let t=1; t<=_n; ) {
      const c = player.hand.pickTop();
      if (!c.back) {
        this.addToHand([c]);
        t++;
        this.messengerOwn.send(c.toString());
        player.messengerOwn.send(c.toString());
      } else {
        player.hand.putUnder([c]);
      }
    }
    this.messengerOwn.send(`です`);
    player.messengerOwn.send(`です`);
    player.checkHand();
    this.checkHand();
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
        player.trashHand(1, market);
      }
    }
    player.divideLife();
    player.checkHand();
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
