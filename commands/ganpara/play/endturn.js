const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'ターンを終える(end)',
      usage: '',
      usageDelim: ' ',
      runIn: ['text', 'group'],
      aliases: ['end'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message) {
    if (!this.game.isStartedGame(message)) {
      return message.sendMessage(this.game.message.NO_STARTED_GAME);
    }
    const game = this.game.returnRoom(message).game;
    if (game.turnPlayer().id == message.author.id) {
      game.roundTurn();
    } else {
      message.sendMessage('あなたのターンではありません!');
    }
  }
};
