const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: '手札を全て対象に公開する、aなら全体に公開する。(oph)',
      usage: '<target:number|a>',
      usageDelim: ' ',
      runIn: ['text', 'group'],
      aliases: ['oph'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message, [target]) {
    if (!this.game.isStartedGame(message)) {
      return message.sendMessage(this.game.message.NO_STARTED_GAME);
    }
    const game = this.game.returnRoom(message).game;
    const player = game.playerFromId(message.author.id);
    if (target=='a') {
      player.openHand();
    } else {
      const targetP = game.playerFromNumber(target);
      if (!targetP) {
        message.sendMessage('不正なプレイヤー番号です');
        return;
      }
      player.openHandTo(targetP);
    }
    return;
  }
};
