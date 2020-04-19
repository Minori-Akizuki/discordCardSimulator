const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'スタートプレイヤーになる(gstp)',
      usage: '',
      usageDelim: ' ',
      runIn: ['text', 'group'],
      aliases: ['gstp'],
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
    const id = message.author.id;
    game.setStartPlayerFromId(id);
    return message.sendMessage(`スタートプレイヤーが${game.playerFromId(id).name}になりました`);
  }
};
