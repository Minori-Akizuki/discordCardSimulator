const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: '前にカードを置く(ptf)',
      usage: '<number:number>',
      runIn: ['text', 'group'],
      aliases: ['ptf'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message, [number]) {
    if (!this.game.isStartedGame(message)) {
      return message.sendMessage(this.game.message.NO_STARTED_GAME);
    }
    if (!number) {
      return message.sendMessage('番号を指定してください');
    }
    const game = this.game.returnRoom(message).game;
    const player = game.playerFromId(message.author.id);
    player.putCardFront(number);
    return;
  }
};
