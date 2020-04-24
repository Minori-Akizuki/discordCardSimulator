module.exports = {
  test: function() {
    return JSON.parse(
        JSON.stringify([
          {nameE: 'RED LIFE', nameJ: '革命派', kind: 'LIFE CARD', cost: '', text: 'このカードは公開してはいけない', isLife: true, deck: 'lifsIn'},
          {nameE: 'BLUE LIFE', nameJ: '保守派', kind: 'LIFE CARD', cost: '', text: 'このカードは公開してはいけない', isLife: true, deck: 'lifsIn'},
          {nameE: 'GANGSTER', nameJ: '構成員', kind: 'GANGSTER CARD', cost: '1', text: '【身代り】【使い捨て1】【MONEYCARD】を拾う', deck: 'gangsters'},
          {nameE: 'GANGSTER', nameJ: '構成員', kind: 'GANGSTER CARD', cost: '1', text: '【身代り】【使い捨て1】【MONEYCARD】を拾う', deck: 'gangsters'},
          {nameE: 'MONEY', nameJ: '金', kind: 'MONEY CARD', cost: 'なし', text: '【購入1】', deck: 'moneys'},
          {nameE: 'MONEY', nameJ: '金', kind: 'MONEY CARD', cost: 'なし', text: '【購入1】', deck: 'moneys'},
          {nameE: 'BULLET', nameJ: '弾丸', kind: 'WEAPON CARD', cost: '1', text: '【弾丸】', deck: 'bullets'},
          {nameE: 'THE BOSS', nameJ: 'ボスの座', kind: 'BOSS CARD', cost: 'なし', text: 'ゲーム開始時に公開すればスタピになれる', deck: 'bullets'},
          {nameE: 'HUSTLER', nameJ: '売人', kind: 'SPECIALIST CARD', cost: '2', text: '【制限1】【公開1】【MONEYCARD】を1枚拾う。その後1コストだけ武器を売却できる。', deck: 'specialists'},
          {nameE: 'GUNSMITH', nameJ: '銃職人', kind: 'SPECIALIST CARD', cost: '2', text: '【制限1】【公開1】場の1コスの【WEAPON CARD】を拾う。追加で金を払えば高いコストも可', deck: 'specialists'},
          {nameE: 'GUN', nameJ: '拳銃', kind: 'WEAPON CARD', cost: '1', text: '【公開1】【射撃1】[殺害1]', deck: 'weapons'},
          {nameE: 'ASSAULT RIFLE', nameJ: '突撃銃', kind: 'WEAPON CARD', cost: '2', text: '【公開1】【射撃1】[殺害1] or [捨札2]', deck: 'weapons'},
          {nameE: 'SPY', nameJ: '潜入者', kind: 'SPECIALIST CARD', cost: '1', text: '【使い捨て】[確認3] / [確認2]をして内1枚を奪う', deck: 'startMarket'},
          {nameE: 'TRICKSTER', nameJ: '詐欺師', kind: 'SPECIALIST CARD', cost: '1', text: '【対応】【使い捨て】コスト1のSPカードからの[確認]を無効にし、そのカードを奪う / 【対応】【公開】取引でこのカードだけを渡す', deck: 'startMarket'},
          {nameE: 'The Don', nameJ: '死んだはずのボス', kind: 'BOSS CARD', cost: '', text: '[通称:THE BOSS] 【制限1】【公開1】場のカードを1枚誰かに渡す', deck: 'noHands'},
          {nameE: 'NEGOTIATOR', nameJ: '交渉人', kind: 'SPECIALIST CARD', cost: '1', text: '【制限1】【公開1】[奪取2]の後2枚渡す'},
          {nameE: 'KILLER', nameJ: '殺し屋', kind: 'SPECIALIST CARD', cost: '3', text: '【使い捨て1】[殺害2]、あなたが黒ならば代わりに[殺害3]'},
          {nameE: 'BEAUTY', nameJ: '美女', kind: 'SPECIALIST CARD', cost: '3', text: '【対応】【SPECIALIST CARD】を無効化し奪う(【KILLER】には使えない)'},
          {nameE: 'HERO', nameJ: '英雄', kind: 'SPECIALIST CARD', cost: '3', text: '【制限2】(2回目の使用時に捨てなければいけない)【対応】【公開】ダメージ効果を一つ無効にする'},
          {nameE: 'THE CHEFISH', nameJ: '料理人', kind: 'SPECIALIST CARD', cost: '2', text: '【制限1】【公開1】[殺害1]、【身代り】をされた場合【MONEYCARD】を1枚拾う', deck: 'noHands'},
          {nameE: 'THE CONFIDANT', nameJ: 'ボスの右腕', kind: 'SPECIALIST CARD', cost: '2', text: '【制限1】【対応】【公開】【BOSS CARD】を公開し行動回数+1', deck: 'noHands'},
          {nameE: 'THE BOILLIONAIRE', nameJ: '億万長者', kind: 'SPECIALIST CARD', cost: '2', text: '【制限1】【対応】【公開】【購入】の行動回数をなくす', deck: 'noHands'},
          {nameE: 'THE ENDORSER', nameJ: '異国の始末屋', kind: 'SPECIALIST CARD', cost: '2', text: '【犯行】自身を【即死1】、その後【死亡】していなければ対象に【即死2】/ 【犯歴】LIFEが摘発対象になる。次のターン開始時に手札に戻す', deck: 'noHands'},
        ]),
    );
  },
};
