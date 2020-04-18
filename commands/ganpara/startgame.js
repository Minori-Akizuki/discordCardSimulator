const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: 'ゲームを開始',
      usage: '',
      runIn: ['text', 'group'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message) {
    this.game.startGame(message);
    message.sendMessage('ゲームが開始されました。');
    message.sendMessage(this.game.returnRoom(message).game.toString());
  }
};
