const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'カードを捨てる(th,tr)',
      usage: '<number:number>',
      runIn: ['text', 'group'],
      aliases: ['th', 'tr'],
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
      return message.sendMessage('手札番号を指定してください');
    }
    const game = this.game.returnRoom(message).game;
    const player = game.playerFromId(message.author.id);
    const market = game.market;
    player.trashHand(number, market);
    return;
  }
};
