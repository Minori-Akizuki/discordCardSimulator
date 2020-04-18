const {Command} = require('klasa');

module.exports = class extends Command {
  /**
   * @constructor
   * @param  {...any} args
   */
  constructor(...args) {
    // コマンドのオプション: https://klasa.js.org/#/docs/klasa/master/typedef/CommandOptions
    super(...args, {
      description: '部屋の状態を表示',
      usage: '',
      runIn: ['text', 'group'],
      aliases: ['rs'],
    });
    this.game = this.client.providers.get('ganparaGame');
  }

  /**
   * @param {Message} message
   */
  async run(message) {
    const status = this.game.status(message);
    return message.sendMessage(status);
  }
};
