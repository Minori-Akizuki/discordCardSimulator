const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'n番のカードを対象に公開する、aなら全体に公開する。(opc)',
      usage: '<target:number|a> <n:number> [...]',
      usageDelim: ' ',
      runIn: ['text', 'group'],
      aliases: ['opc'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message, [target, ...ns]) {
    if (!this.game.isStartedGame(message)) {
      return message.sendMessage(this.game.message.NO_STARTED_GAME);
    }
    const game = this.game.returnRoom(message).game;
    const player = game.playerFromId(message.author.id);
    if (target=='a') {
      player.openCards(...ns);
    } else {
      const targetP = game.playerFromNumber(target);
      if (!targetP) {
        message.sendMessage('不正なプレイヤー番号です');
        return;
      }
      player.openCardsTo(targetP, ...ns);
    }
    return;
  }
};
